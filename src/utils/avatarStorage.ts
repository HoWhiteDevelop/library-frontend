export const saveAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    // 生成文件名：用户ID + 时间戳 + 原始文件扩展名
    const extension = file.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${extension}`;

    // 创建 FormData
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("fileName", fileName);

    // 发送到本地的文件处理接口
    const response = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("上传失败");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "上传失败");
    }

    return result.path;
  } catch (error) {
    console.error("保存头像失败:", error);
    throw error;
  }
};

export const getAvatarPath = (userId: string): string | null => {
  const avatarPath = localStorage.getItem(`avatar_${userId}`);
  return avatarPath;
};
