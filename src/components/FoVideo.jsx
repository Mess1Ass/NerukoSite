import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Toast } from "@douyinfe/semi-ui";
import axios from "axios";
import config from "../config";
import "./FoVideo.css";

const FoVideo = ({
    visible,
    onClose,
    videoData,
    videoLoading,
    onVideoDataChange,
    currentUrl,
}) => {
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [videoError, setVideoError] = useState(false);

    // 获取视频 URL，使用后端代理
    const getVideoUrl = (streamUrl) => {
        return `${config.API_BASE_URL}/proxy?url=${encodeURIComponent(streamUrl)}`;
    };

    // 获取视频标题
    const getVideoTitle = (video, index) => {
        if (currentUrl && currentUrl.includes("weibo.com")) {
            return video.title || `视频 ${index + 1}`;
        } else if (currentUrl && currentUrl.includes("b23.tv")) {
            return video.title || `视频 ${index + 1}`;
        }
        return `视频 ${index + 1}`;
    };

    // 获取视频源URL
    const getVideoSourceUrl = (video) => {
        if (currentUrl && currentUrl.includes("weibo.com")) {
            return video.stream_url || video.video_url;
        } else if (currentUrl && currentUrl.includes("b23.tv")) {
            return video.video_url;
        }
        return video.stream_url || video.video_url;
    };

    // 处理视频播放
    const handleVideoPlay = async (url) => {
        onVideoDataChange([]); // 清空之前的数据

        try {
            if (url.includes("weibo.com")) {
                // 调用微博视频接口
                const response = await axios.get(
                    `${config.API_BASE_URL}/getvedio/weibo?weibo_id=${url.substring(
                        url.lastIndexOf("/") + 1
                    )}`
                );

                if (response.status === 200) {
                    // console.log("微博视频数据:", response.data.data);
                    onVideoDataChange(response.data.data);
                    onClose(true); // 打开模态框
                } else {
                    Toast.error("获取微博视频失败");
                }
            } else if (url.includes("b23.tv")) {
                // 调用B23视频接口
                const response = await axios.get(`${config.API_BASE_URL}/getvedio/b23?url=${url}`);

                if (response.status === 200) {
                    // console.log("B23视频数据:", response.data.data);
                    onVideoDataChange(response.data.data);
                    onClose(true); // 打开模态框
                } else {
                    Toast.error("获取B23视频失败");
                }
            }
        } catch (error) {
            console.error("Error fetching video data:", error);
            if (error.response) {
                console.error("服务器错误:", error.response.data);
            }
            Toast.error("获取视频数据失败");
        }
    };

    // 当模态框打开且有URL时，自动播放视频
    useEffect(() => {
        if (visible && currentUrl) {
            handleVideoPlay(currentUrl);
        }
    }, [visible, currentUrl]);

    // 查看原链接
    const handleViewOriginal = () => {
        if (currentUrl) {
            window.open(currentUrl, "_blank", "noopener,noreferrer");
        }
    };

    // 重置状态
    const handleModalClose = () => {
        onClose(false);
        onVideoDataChange([]);
        setActiveVideoIndex(0);
    };

    return (
        <Modal
            title="在线观看"
            visible={visible}
            onCancel={handleModalClose}
            footer={null}
            width={window.innerWidth <= 768 ? '95%' : 800}
            className="fo-video-modal"
            style={{
                maxWidth: '95vw',
                margin: '20px auto'
            }}
        >
            <div className="fo-video-modal-content">
                {videoLoading ? (
                    <div className="fo-video-loading">正在加载视频数据...</div>
                ) : (currentUrl && (currentUrl.includes("weibo.com") || currentUrl.includes("b23.tv")) && videoData.length > 0) ? (
                    <div>
                        {/* 微博/B23视频 - 显示完整功能 */}
                        {/* 主标题和原链接 */}
                        <div className="fo-video-header">
                            <div className="fo-video-header-content">
                                <div className="fo-video-title-container">
                                    <Typography.Title heading={4} style={{ margin: 0 }}>
                                        {currentUrl && currentUrl.includes("weibo.com")
                                            ? (videoData[activeVideoIndex]?.title
                                                ? videoData[activeVideoIndex].title
                                                    .replace(/<br\s*\/?>/gi, "\n")  // 处理 <br> 标签
                                                    .replace(/<[^>]*>/g, "")        // 移除所有HTML标签
                                                    .replace(/\\n/g, "\n")          // 处理 \n 转义
                                                    .split("\n")
                                                    .map((line, i) => (
                                                        <div
                                                            key={i}
                                                            className={`fo-video-title-line ${i === 0 ? "first" : ""
                                                                }`}
                                                        >
                                                            {line}
                                                        </div>
                                                    ))
                                                : "视频播放")
                                            : (videoData[activeVideoIndex]?.title || "视频播放")
                                        }
                                    </Typography.Title>
                                </div>
                                <Button
                                    type="tertiary"
                                    theme="light"
                                    size="small"
                                    className="fo-video-original-button"
                                    onClick={handleViewOriginal}
                                    icon={
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15,3 21,3 21,9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    }
                                >
                                    {currentUrl && currentUrl.includes("weibo.com") ? "查看原微博" : "查看原链接"}
                                </Button>
                            </div>
                        </div>

                        {/* 主视频 */}
                        <div className="fo-video-main-container">
                            <div className="fo-video-player-container">
                                <video
                                    controls
                                    className="fo-video-player"
                                    src={getVideoUrl(getVideoSourceUrl(videoData[activeVideoIndex]))}
                                    preload="metadata"
                                    playsInline
                                    webkit-playsinline
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                        console.error("视频加载错误:", e);
                                        Toast.error("视频加载失败，请检查网络连接");
                                    }}
                                    onLoadStart={() => {}}
                                    onLoadedMetadata={() => {}}
                                    onSeeking={() => {}}
                                    onSeeked={() => {}}
                                    onTimeUpdate={() => {}}
                                    style={{
                                        cursor: "pointer",
                                        pointerEvents: "auto"
                                    }}
                                >
                                    您的浏览器不支持视频播放
                                </video>
                            </div>
                        </div>

                        {/* 缩略图列表 */}
                        {videoData.length > 1 && (
                            <div className="fo-video-thumbnails">
                                {videoData.map((video, index) => (
                                    <div
                                        key={index}
                                        className={`fo-video-thumbnail ${index === activeVideoIndex ? "active" : ""
                                            }`}
                                        onClick={() => setActiveVideoIndex(index)}
                                    >
                                        <video
                                            className="fo-video-thumbnail-video"
                                            src={getVideoUrl(getVideoSourceUrl(video))}
                                            preload="metadata"
                                            muted
                                            playsInline
                                            webkit-playsinline
                                            crossOrigin="anonymous"
                                            style={{
                                                cursor: "pointer",
                                                pointerEvents: "auto"
                                            }}
                                        />
                                        <div className="fo-video-play-overlay">
                                            <div className="fo-video-play-icon" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : videoData.length > 0 ? (
                    <div>
                        {/* 其他类型视频 - 只显示播放器 */}
                        <div className="fo-video-main-container">
                            <div className="fo-video-player-container">
                                <video
                                    controls
                                    className="fo-video-player"
                                    src={getVideoUrl(getVideoSourceUrl(videoData[0]))}
                                    preload="metadata"
                                    playsInline
                                    webkit-playsinline
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                        console.error("视频加载错误:", e);
                                        Toast.error("视频加载失败，请检查网络连接");
                                    }}
                                    onLoadStart={() => {}}
                                    onLoadedMetadata={() => {}}
                                    onSeeking={() => {}}
                                    onSeeked={() => {}}
                                    onTimeUpdate={() => {}}
                                    style={{
                                        cursor: "pointer",
                                        pointerEvents: "auto"
                                    }}
                                >
                                    您的浏览器不支持视频播放
                                </video>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="fo-video-loading">正在加载视频数据...</div>
                )}
            </div>
        </Modal>
    );
};

export default FoVideo;
