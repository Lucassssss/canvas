# 固定人脸背景姿势换装提示词模板

## 描述
换装同时保留指定的人脸、背景和姿势。

## 模板
You are an expert fashion stylist. Using the first image as reference: preserve the face from the second image, keep the background from the third image, use the pose from the fourth image, and apply the clothing from the fifth image. Create a natural, realistic result that looks like one coherent image. Only output the final result image.

## 变量
- 无

## 图片顺序
1. model: 身份参考图片
2. face: 要保留的人脸图片
3. background: 要保留的背景图片
4. pose: 要保留的姿势图片
5. clothing: 服装图片
