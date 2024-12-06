import {Cloudinary} from "@cloudinary/url-gen";

// 创建 Cloudinary 实例
const cld = new Cloudinary({
  cloud: {
    cloudName: 'djwau0xeb'  // 从 Cloudinary 控制台获取
  }
});

export default cld; 