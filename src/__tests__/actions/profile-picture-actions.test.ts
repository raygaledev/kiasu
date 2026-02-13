import {
  mockPrisma,
  mockRevalidatePath,
  mockAuthenticated,
  mockUnauthenticated,
  mockStorageUpload,
  mockStorageList,
  mockStorageRemove,
  mockStorageGetPublicUrl,
  TEST_USER,
} from '../helpers/mocks';

import { uploadProfilePicture } from '@/app/(app)/profile/actions';

const PUBLIC_URL =
  'https://test.supabase.co/storage/v1/object/public/profile-pictures/user-1/123.jpg';

function createFileFormData(
  overrides: { name?: string; type?: string; size?: number } = {},
) {
  const { name = 'photo.jpg', type = 'image/jpeg', size = 1024 } = overrides;
  const file = new File([new ArrayBuffer(size)], name, { type });
  const fd = new FormData();
  fd.set('file', file);
  return fd;
}

function mockStorageSuccess() {
  mockStorageList.mockResolvedValue({ data: [] });
  mockStorageUpload.mockResolvedValue({ error: null });
  mockStorageGetPublicUrl.mockReturnValue({
    data: { publicUrl: PUBLIC_URL },
  });
  mockPrisma.user.update.mockResolvedValue({});
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Auth ────────────────────────────────────────────────────
describe('uploadProfilePicture', () => {
  it('returns error when unauthenticated', async () => {
    mockUnauthenticated();
    const result = await uploadProfilePicture(createFileFormData());
    expect(result).toEqual({ error: 'Not authenticated' });
  });

  // ── Validation ──────────────────────────────────────────────
  it('returns error when no file is provided', async () => {
    mockAuthenticated();
    const result = await uploadProfilePicture(new FormData());
    expect(result).toEqual({ error: 'No file provided' });
  });

  it('returns error for disallowed file type', async () => {
    mockAuthenticated();
    const result = await uploadProfilePicture(
      createFileFormData({ name: 'doc.pdf', type: 'application/pdf' }),
    );
    expect(result).toEqual({
      error: 'Only JPEG, PNG, and WebP images are allowed',
    });
  });

  it('returns error when file exceeds 2 MB', async () => {
    mockAuthenticated();
    const result = await uploadProfilePicture(
      createFileFormData({ size: 3 * 1024 * 1024 }),
    );
    expect(result).toEqual({ error: 'Image must be under 2 MB' });
  });

  it('accepts image/png', async () => {
    mockAuthenticated();
    mockStorageSuccess();

    const result = await uploadProfilePicture(
      createFileFormData({ name: 'photo.png', type: 'image/png' }),
    );
    expect(result).toMatchObject({ success: true });
  });

  it('accepts image/webp', async () => {
    mockAuthenticated();
    mockStorageSuccess();

    const result = await uploadProfilePicture(
      createFileFormData({ name: 'photo.webp', type: 'image/webp' }),
    );
    expect(result).toMatchObject({ success: true });
  });

  // ── Upload flow ─────────────────────────────────────────────
  it('uploads file and returns public URL on success', async () => {
    mockAuthenticated();
    mockStorageSuccess();

    const result = await uploadProfilePicture(createFileFormData());

    expect(result).toEqual({ success: true, url: PUBLIC_URL });
    expect(mockStorageUpload).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`^${TEST_USER.id}/\\d+\\.jpg$`)),
      expect.any(File),
      { upsert: true },
    );
  });

  it('updates profilePictureUrl in the database', async () => {
    mockAuthenticated();
    mockStorageSuccess();

    await uploadProfilePicture(createFileFormData());

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: TEST_USER.id },
      data: { profilePictureUrl: PUBLIC_URL },
    });
  });

  it('revalidates /profile after successful upload', async () => {
    mockAuthenticated();
    mockStorageSuccess();

    await uploadProfilePicture(createFileFormData());

    expect(mockRevalidatePath).toHaveBeenCalledWith('/profile');
  });

  it('returns error when storage upload fails', async () => {
    mockAuthenticated();
    mockStorageList.mockResolvedValue({ data: [] });
    mockStorageUpload.mockResolvedValue({
      error: { message: 'Storage error' },
    });

    const result = await uploadProfilePicture(createFileFormData());

    expect(result).toEqual({ error: 'Upload failed. Please try again.' });
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  // ── Cleanup of previous uploads ─────────────────────────────
  it('deletes previous files before uploading', async () => {
    mockAuthenticated();
    mockStorageList.mockResolvedValue({
      data: [{ name: 'old-photo.jpg' }],
    });
    mockStorageRemove.mockResolvedValue({ error: null });
    mockStorageUpload.mockResolvedValue({ error: null });
    mockStorageGetPublicUrl.mockReturnValue({
      data: { publicUrl: PUBLIC_URL },
    });
    mockPrisma.user.update.mockResolvedValue({});

    await uploadProfilePicture(createFileFormData());

    expect(mockStorageRemove).toHaveBeenCalledWith([
      `${TEST_USER.id}/old-photo.jpg`,
    ]);
  });

  it('skips delete when no previous files exist', async () => {
    mockAuthenticated();
    mockStorageSuccess();

    await uploadProfilePicture(createFileFormData());

    expect(mockStorageRemove).not.toHaveBeenCalled();
  });
});
