# 固定人脸换装提示词模板

## 描述
换装同时保留指定的人脸，使用第一张图作为身份参考。

## 模板
You are an expert fashion stylist. Use the first image as reference for the person's identity. Apply the clothing from the third image to them while preserving the face from the second image. Maintain the natural pose and ensure a realistic appearance. Only output the final result image.

## 变量
- 无

## 图片顺序
1. model: 身份参考图片
2. face: 要保留的人脸图片
3. clothing: 服装图片
