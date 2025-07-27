import React, { useState, useEffect } from "react";
import { Typography, Timeline, Carousel, Button } from "@douyinfe/semi-ui";
import { IconClose } from "@douyinfe/semi-icons";
import "./Home.css";

const generateCarouselImages = () => {
  const imgCount = 12; // 根据实际图片数量设置
  const bgImgs = [];
  for (let i = 1; i <= imgCount; i++) {
    bgImgs.push(`/assets/Home/CarouselImgs/${i}.JPG`);
  }
  return bgImgs;
};

const carouselImages = generateCarouselImages();

const generateCarouselVideos = () => {
  const imgCount = 3; // 根据实际图片数量设置
  const bgImgs = [];
  for (let i = 1; i <= imgCount; i++) {
    bgImgs.push(`http://video.tool4me.cn/neruko/homeVideo/${i}.mp4`);
  }
  return bgImgs;
};

const carouselVideos = generateCarouselVideos();

// 个人信息
const person = {
  name: "Neruko",
  desc: `𓃠 创建角色\n\nNeruko_ver.0610🕳️\n\nID：Neruko （捏路口）/ 猫猫 / 魔法猫咪 👾\n\nINFP-δ型\n\n▷ No.02 @0nline_offical \n▷ 隶属：@MetaMates次元少女 ·紫色终端\n \n"チートスキル所持...ただし褒められると故障"  \n  \n𓃠 P.S. UTC+8 03:00-06:00幽灵出没`,
  avatar: "/assets/Home/NerukoAvatar.jpg",
  tags: ["活力", "可爱", "努力", "舞台魅力", "超帅"],
};

// 时间轴事件
const timelineItems = [
  {
    time: "2024-12-04",
    title: "MM公式照初披露",
    desc: "正式公布公式照，开启偶像之路",
  },
  { time: "2024-12-07", title: "MM舞台初披露", desc: "猫猫的第一次舞台" },
  {
    time: "2025-03-28",
    title: "OM2.0 && 升格",
    desc: "MM的OM2.0兼我们猫猫的升格！成为正式成员啦",
  },
  {
    time: "2025-06-07",
    title: "生日SP",
    desc: "属于魔法猫咪的第一个生日SP特殊舞台",
  },
  {
    time: "2025-06-10",
    title: "生日",
    desc: "猫猫的真实生日，让我们祝她“生日快乐”！",
  },
  {
    time: "2025-07-10",
    title: "on!ine兼任公式照初披露",
    desc: "兼任on!ine，真正的人机猫猫",
  },
  {
    time: "2025-07-18",
    title: "on!ine兼任舞台初披露",
    desc: "on!ine兼任舞台大公开，后辈猫变前辈猫",
  },
  // 可继续添加
];

export default function Home() {
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = React.useRef([]);

  useEffect(() => {
    // 随机选择一个视频
    const randomIndex = Math.floor(Math.random() * carouselVideos.length);
    setCurrentVideoIndex(randomIndex);
  }, []); // 只在组件挂载时执行一次

  const handleCloseIntro = () => {
    setShowIntroVideo(false);
  };

  const handleVideoEnd = () => {
    // 视频播放结束后自动关闭
    setShowIntroVideo(false);
  };

  if (showIntroVideo) {
    return (
      <div className="intro-video-overlay">
        <video
          src={carouselVideos[currentVideoIndex]}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="intro-video"
        />
        <Button
          icon={<IconClose />}
          onClick={handleCloseIntro}
          className="intro-close-button"
          type="tertiary"
          theme="solid"
        >
          跳过
        </Button>
      </div>
    );
  }

  return (
    <div
      className="home-scroll-container"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* 第一模块：粉制视频 */}
      <section className="home-section home-section-carousel">
        <div className="home-carousel-wrap">
          <Carousel
            theme="light"
            showArrow={true}
            showIndicator={true}
            autoPlay={{ interval: 5000, hoverToPause: true }}
            arrowType="hover"
          >
            {carouselVideos.map((src, index) => {
              return (
                <div
                  key={`video-container-${index}`}
                  style={{
                    width: "100%",
                    height: "93%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                    autoPlay={false}
                    muted={true}
                    loop={false}
                    controls
                    preload="metadata"
                    controlsList="nodownload"
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </section>
      {/* 第二模块：个人介绍 */}
      <section className="home-section home-section-profile">
        <img src={person.avatar} alt={person.name} className="home-avatar" />
        <Typography.Title heading={2} style={{ marginBottom: 12 }}>
          {person.name}
        </Typography.Title>
        <Typography.Paragraph
          spacing="extended"
          style={{
            fontSize: 20,
            color: "#444",
            marginBottom: 16,
            textAlign: "center",
            maxWidth: 600,
            whiteSpace: "pre-line",
          }}
        >
          {person.desc}
        </Typography.Paragraph>
        <div className="home-tags">
          {person.tags.map((tag) => (
            <span key={tag} className="home-tag">
              {tag}
            </span>
          ))}
        </div>
        <a
          href="https://weibo.com/u/6480076001"
          style={{ marginTop: 16, display: "block", textAlign: "center" }}
        >
          魔法猫咪微博主页
        </a>
      </section>
      {/* 第三模块：优选图片 */}
      <section className="home-section home-section-carousel">
        <div className="home-carousel-wrap">
          <Carousel
            theme="light"
            autoPlay={{ interval: 5000, hoverToPause: true }}
            arrowType="hover"
          >
            {carouselImages.map((src, index) => {
              return (
                <img
                  key={index}
                  src={src}
                  alt={`banner${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              );
            })}
          </Carousel>
        </div>
      </section>
      {/* 第四模块：时间轴 */}
      <section className="home-section home-section-timeline">
        <Typography.Title heading={3} style={{ marginBottom: 32 }}>
          成长大事记
        </Typography.Title>
        <div className="home-timeline-wrap">
          <Timeline mode="alternate">
            {timelineItems.map((item) => (
              <Timeline.Item key={item.time} time={item.time} type="default">
                <Typography.Text strong>{item.title}</Typography.Text>
                <Typography.Paragraph style={{ margin: 0 }}>
                  {item.desc}
                </Typography.Paragraph>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </section>
    </div>
  );
}
