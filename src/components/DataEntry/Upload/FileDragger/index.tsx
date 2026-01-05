import Typography from '@/components/Typography';
import {
  Upload,
  UploadFile,
  UploadProps,
  FormInstance,
  Divider,
  Modal,
} from "antd";
import { FC, useState } from "react";
import { RcFile } from "antd/es/upload";
import "./custom.css";
import Button from "@/components/Button";
import Image from "next/image";
import { uploadFile } from "@/common/api/customer-service/file-upload";
import { useNotification } from "@/hooks/notification.hook";
import { useDataTestIdWithPath } from "@/utils/DataTestId/data-test-id.utils";
import { usePathname } from "next/navigation";

const { Dragger } = Upload;

type FormType = {
  key: any;
  formInstance: FormInstance<any>;
};

interface UploadFileDraggerProps {
  dataTestId?: string;
  name?: string;
  file: UploadFile[];
  setFile: (file: UploadFile[]) => void;
  form?: FormType;
  label?: string;
  maxCount?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  acceptedExtensions?: string;
  description?: string;
  required?: boolean;
  className?: string;
  showUploadList?: boolean;
  customFileList?: boolean;
}

const UploadFileDragger: FC<UploadFileDraggerProps> = ({
  dataTestId,
  name,
  file,
  setFile,
  form,
  label,
  maxCount = 5,
  maxSize = 10,
  acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  acceptedExtensions = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls',
  description = 'PDF, DOC, DOCX, JPG, PNG, XLS, XLSX',
  required = false,
  className = '',
  showUploadList = false,
  customFileList = true,
}) => {
  const { notification } = useNotification();
  const [pendingFiles, setPendingFiles] = useState<RcFile[]>([]);

  // Check if any file is currently uploading
  const isUploading = file.some((f) => f.status === 'uploading');

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'ri-file-pdf-line text-red-500';
      case 'doc':
      case 'docx':
        return 'ri-file-word-line text-blue-600';
      case 'xls':
      case 'xlsx':
        return 'ri-file-excel-line text-green-600';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'ri-image-line text-purple-500';
      default:
        return 'ri-file-line text-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const CustomFileList: FC<{ fileList: UploadFile[] }> = ({ fileList }) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [filePreview, setFilePreview] = useState<UploadFile | null>(null);
    return (
      <div className="mt-4">
        <Modal
          open={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          footer={null}
          width={480}
        >
          {filePreview && (
            <div className="flex flex-col items-center">
              {filePreview.url ? (
                <img
                  src={filePreview.url}
                  alt="preview"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <Image
                  src="/assets/icons/file-type-img.svg"
                  alt="img-icon"
                  width={200}
                  height={200}
                />
              )}
            </div>
          )}
        </Modal>
        {fileList.map((file) => {
          const fileType = file.name.split('.').pop()?.toLowerCase();
          return (
            <div
              key={file.uid}
              className={`flex justify-between p-3 border ${
                file.status === 'error'
                  ? 'border-error'
                  : 'border-border-primary'
              }  rounded-lg mb-2 bg-background-secondary`}
            >
              <div
                className="flex w-[calc(100%_-_100px)] items-center"
                onClick={() => {
                  const isImage =
                    fileType === 'jpg' ||
                    fileType === 'jpeg' ||
                    fileType === 'png';

                  if (file.originFileObj) {
                    if (isImage) {
                      setIsOpenModal(true);
                      setFilePreview({
                        ...file,
                        url: URL.createObjectURL(file.originFileObj as File),
                      });
                    } else {
                      if (file.response?.url) {
                        window.open(file.response.url, '_blank');
                      }
                    }
                  }
                }}
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                  {fileType === 'pdf' ? (
                    <Image
                      src="/assets/icons/file-type-pdf.svg"
                      alt="pdf-icon"
                      className="mx-auto"
                      width={24}
                      height={24}
                    />
                  ) : fileType === 'jpg' || fileType === 'jpeg' ? (
                    <>
                      {file?.response?.url ? (
                        <Image
                          src={file.response.url}
                          alt="img-preview"
                          className="mx-auto w-10 h-10 object-cover rounded"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <Image
                          src="/assets/icons/file-type-img.svg"
                          alt="img-icon"
                          className="mx-auto"
                          width={24}
                          height={24}
                        />
                      )}
                    </>
                  ) : fileType === 'png' ? (
                    <>
                      {file?.response?.url ? (
                        <Image
                          src={file.response.url}
                          alt="img-preview"
                          className="mx-auto w-10 h-10 object-cover rounded"
                          width={24}
                          height={24}
                        />
                      ) : (
                        <Image
                          src="/assets/icons/file-type-png.svg"
                          alt="img-icon"
                          className="mx-auto"
                          width={24}
                          height={24}
                        />
                      )}
                    </>
                  ) : (
                    <i
                      className={`${getFileIcon(file.name || '')} text-lg`}
                    ></i>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Typography
                    variant="paragraph-small"
                    className="!text-text-secondary !font-medium truncate"
                  >
                    {file.name}
                  </Typography>
                  <div className="flex items-center gap-2 mt-1">
                    <Typography
                      variant="paragraph-small"
                      className="!text-text-quarternary"
                    >
                      {formatFileSize(file.size || 0)}
                    </Typography>
                    <Divider type="vertical" className="!mr-0" />
                    {file.status === 'done' && (
                      <Typography
                        variant="paragraph-small"
                        className="!text-success"
                      >
                        <i className="ri-checkbox-circle-line mr-1"></i>
                        สำเร็จ
                      </Typography>
                    )}
                    {file.status === 'error' && (
                      <Typography
                        variant="paragraph-small"
                        className="!text-error"
                      >
                        <i className="ri-error-warning-line mr-1"></i>
                        ล้มเหลว
                      </Typography>
                    )}
                    {file.status === 'uploading' && (
                      <Typography
                        variant="paragraph-small"
                        className="!text-text-quinary text-xs"
                      >
                        <i className="ri-upload-cloud-2-line mr-1"></i>
                        กำลังอัปโหลด
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Button
                  variant="ghost"
                  color="neutral"
                  size="small"
                  disabled={file.status === 'uploading'}
                  icon={
                    <i className="ri-delete-bin-6-line text-neutral-60"></i>
                  }
                  onClick={() => {
                    const currentFiles = fileList || [];
                    const updatedFiles = currentFiles.filter(
                      (f: UploadFile) => f.uid !== file.uid
                    );

                    const finalFiles =
                      updatedFiles.length > 0 ? updatedFiles : [];
                    setFile(finalFiles);

                    if (form) {
                      const { key, formInstance } = form;
                      formInstance.setFieldValue(key, finalFiles);

                      if (!finalFiles || finalFiles.length === 0) {
                        formInstance.setFields([
                          {
                            name: key,
                            errors: [],
                          },
                        ]);
                      }
                    }
                  }}
                />
                {file.status === 'error' && (
                  <Typography
                    variant="paragraph-small"
                    className="!text-error !font-medium"
                  >
                    ลองใหม่อีกครั้ง
                  </Typography>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Handle multiple files upload in parallel
  const handleMultipleFileUpload = async (filesToUpload: RcFile[]) => {
    const currentFiles = file || [];

    // Create UploadFile objects for all files
    const uploadFiles: UploadFile[] = filesToUpload.map((fileToUpload) => ({
      uid: fileToUpload.uid || Date.now().toString() + Math.random().toString(),
      name: fileToUpload.name,
      size: fileToUpload.size,
      type: fileToUpload.type,
      status: 'uploading',
      originFileObj: fileToUpload,
      lastModified: fileToUpload.lastModified,
      lastModifiedDate: fileToUpload.lastModifiedDate,
    }));

    const updatedFiles = [...currentFiles, ...uploadFiles];
    setFile(updatedFiles);

    if (form) {
      const { key, formInstance } = form;
      formInstance.setFieldValue(key, updatedFiles);
      formInstance.setFields([
        {
          name: key,
          errors: [],
        },
      ]);
    }

    // Upload all files in parallel using Promise.all
    const uploadPromises = uploadFiles.map(async (fileUpload) => {
      try {
        const formData = new FormData();
        formData.append('file', fileUpload.originFileObj as File, 'test');
        formData.append('folderName', 'test');
        formData.append('isPublic', 'true');
        const response = await uploadFile(formData);

        return {
          uid: fileUpload.uid,
          status: 'done' as const,
          response: response,
          url: response?.url || undefined,
        };
      } catch (error) {
        console.error('Upload failed for:', fileUpload.name, error);
        return {
          uid: fileUpload.uid,
          status: 'error' as const,
          error: error,
        };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);

      // Update all files with their final status
      const updatedFilesWithResults = updatedFiles.map((f) => {
        const result = results.find((r) => r.uid === f.uid);
        if (result) {
          return {
            ...f,
            status: result.status,
            response: result.response,
            url: result.url,
            error: result.error,
          };
        }
        return f;
      });

      setFile(updatedFilesWithResults);

      if (form) {
        const { key, formInstance } = form;
        formInstance.setFieldValue(key, updatedFilesWithResults);
      }
    } catch (error) {
      console.error('Promise.all failed:', error);
    }
  };

  // Handle single file upload (fallback)
  const handleFileUpload = async (fileToUpload: RcFile) => {
    await handleMultipleFileUpload([fileToUpload]);
  };

  const onChange: UploadProps['onChange'] = ({ file: newFile, fileList }) => {
    if (newFile.status === 'removed') {
      const currentFiles = file || [];
      const updatedFiles = currentFiles.filter(
        (f: UploadFile) => f.uid !== newFile.uid
      );

      const finalFiles = updatedFiles.length > 0 ? updatedFiles : [];
      setFile(finalFiles);

      if (form) {
        const { key, formInstance } = form;
        formInstance.setFieldValue(key, finalFiles);

        if (!finalFiles || finalFiles.length === 0) {
          formInstance.setFields([
            {
              name: key,
              errors: [],
            },
          ]);
        }
      }
    }
  };

  const uploadProps: UploadProps = {
    multiple: true,
    maxCount,
    accept: acceptedExtensions,
    showUploadList,
    fileList: file || [],
    disabled: isUploading, // Disable upload area when files are uploading
    beforeUpload: (uploadFile: RcFile, fileList: RcFile[]) => {
      // Check if any file is currently uploading
      if (isUploading) {
        notification.error({
          message: 'กรุณารอให้การอัปโหลดปัจจุบันเสร็จสิ้นก่อน',
          duration: 3,
          icon: <i className="ri-information-line text-error"></i>,
        });
        return Upload.LIST_IGNORE;
      }

      // Check total count including current batch
      const totalFilesAfterUpload = file.length + fileList.length;
      if (totalFilesAfterUpload > maxCount) {
        notification.error({
          message: `สามารถอัปโหลดได้สูงสุด ${maxCount} ไฟล์! กำลังพยายามอัปโหลด ${
            fileList.length
          } ไฟล์ แต่เหลือที่ว่างเพียง ${maxCount - file.length} ไฟล์`,
          duration: 4,
          icon: <i className="ri-information-line text-error"></i>,
        });
        return Upload.LIST_IGNORE;
      }

      const isDuplicate = file.some(
        (existingFile) => existingFile.name === uploadFile.name
      );
      if (isDuplicate) {
        notification.error({
          message: `ไฟล์ "${uploadFile.name}" มีอยู่แล้ว กรุณาเลือกไฟล์อื่น`,
          duration: 3,
          icon: <i className="ri-information-line text-error"></i>,
        });
        return Upload.LIST_IGNORE;
      }

      const isValidType = acceptedTypes.includes(uploadFile.type);

      if (!isValidType) {
        notification.error({
          message: `รองรับเฉพาะไฟล์ ${description} เท่านั้น!`,
          duration: 3,
          icon: <i className="ri-information-line text-error"></i>,
        });
        return Upload.LIST_IGNORE;
      }

      const isValidSize = uploadFile.size / 1024 / 1024 < maxSize;
      if (!isValidSize) {
        notification.error({
          message: `ไม่รองรับไฟล์ขนาดเกิน ${maxSize} MB`,
          duration: 3,
          icon: <i className="ri-information-line text-error"></i>,
        });
        return Upload.LIST_IGNORE;
      }

      // Individual maxCount check is now handled above with batch validation

      // Check if this is the last file in the current batch
      const currentIndex = fileList.findIndex((f) => f.uid === uploadFile.uid);
      const isLastFile = currentIndex === fileList.length - 1;

      if (isLastFile && fileList.length > 1) {
        // Process all files in parallel
        handleMultipleFileUpload(fileList);
      } else if (fileList.length === 1) {
        // Single file upload
        handleFileUpload(uploadFile);
      }

      return false;
    },
    onChange,
  };

  const useDataTestId = useDataTestIdWithPath(usePathname(), 'upload-file-dragger', name, dataTestId);

  return (
    <div className={className}>
      {label && (
        <div className="mb-2">
          {label}
          {required && <span className="text-error ml-1 text-xs">*</span>}
        </div>
      )}

      <Dragger
        data-testid={useDataTestId}
        {...uploadProps}
        className={`custom-allkons-upload-file-dragger ${
          isUploading ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-white border border-border-primary rounded-lg flex items-center justify-center">
            {isUploading ? (
              <i className="ri-loader-4-line text-2xl text-icon-tertiary animate-spin"></i>
            ) : (
              <i className="ri-upload-cloud-2-line text-2xl text-icon-tertiary"></i>
            )}
          </div>
          <Typography variant="paragraph-small" className="!mb-1 !mt-3">
            <span className="text-button-tertiary font-semibold mr-2">
              {isUploading ? 'กำลังอัปโหลด...' : 'คลิกเพื่ออัพโหลด'}
            </span>
            {!isUploading && (
              <span className="text-text-tertiary">
                หรือ ลากแล้ววางไฟล์ที่นี่
              </span>
            )}
          </Typography>
          <Typography
            variant="paragraph-small"
            className="!text-text-placeholder"
          >
            {isUploading
              ? 'กรุณารอให้การอัปโหลดเสร็จสิ้น'
              : `${description} (สูงสุด ${maxSize}MB)`}
          </Typography>
        </div>
      </Dragger>

      {/* Custom File List */}
      {customFileList && file && file.length > 0 && (
        <CustomFileList fileList={file} />
      )}
    </div>
  );
};

export default UploadFileDragger;
