import React, { useState } from 'react';
import { Timeline, Typography, Button, TreeSelect, BackTop } from '@douyinfe/semi-ui';
import { IconLikeHeart, IconArrowUp } from '@douyinfe/semi-icons';
import axios from 'axios';
import './Focus.css';

const focusEvents = [
  {
    date: '2024.12.31',
    title: '新业坊',
    links: [
      { url: 'https://weibo.com/5802147398/5118181813520145', label: '单人直拍1' },
      { url: 'https://weibo.com/7855924295/5117840246441895', label: '单人直拍2' }
    ]
  },
  {
    date: '2025.01.05',
    title: '新业坊',
    links: [
      { url: 'https://weibo.com/5802147398/5119790258328717', label: '单人直拍' }
    ]
  },
  {
    date: '2025.02.16',
    title: '世界树',
    links: [
      { url: 'https://weibo.com/5802147398/5135064177054411', label: '单人直拍' }
    ]
  },
  {
    date: '2025.03.09',
    title: '次乐园',
    links: [
      { url: 'https://weibo.com/5802147398/5142435420963513', label: '单人直拍' },
      { url: 'https://weibo.com/7840361149/5142437937025735', label: '全景' }
    ]
  },
  {
    date: '2025.03.23',
    title: '小南门',
    links: [
      { url: 'https://weibo.com/5802147398/5147665189831070', label: '单人直拍' }
    ]
  },
  {
    date: '2025.03.28',
    title: '世界树 Over MetaMates Genkai 2nd OneMan Live',
    links: [
      { url: 'https://weibo.com/7855924295/5149348364550468', label: '全景' },
      { url: 'https://weibo.com/1018872051/5149560381114696', label: '单人直拍' }
    ]
  },
  {
    date: '2025.04.13',
    title: '魔镜LIVE',
    links: [
      { url: 'https://weibo.com/7840361149/5155382142177972', label: '半全景' }
    ]
  },
  {
    date: '2025.04.20',
    title: '世界树 Naya’s Day',
    links: [
      { url: 'https://weibo.com/7855924295/5157805355436078', label: '全景' },
      { url: 'https://weibo.com/7840361149/5157906061202213', label: '单人直拍' }
    ]
  },
  {
    date: '2025.05.01',
    title: '世界树',
    links: [
      { url: 'https://weibo.com/5802147398/5161791206199258', label: '直拍' }
    ]
  },
  {
    date: '2025.05.02',
    title: '摩登天空',
    links: [
      { url: 'https://weibo.com/5802147398/5162143139234859', label: '直拍' }
    ]
  },
  {
    date: '2025.05.04',
    title: '一百',
    links: [
      { url: 'https://video.weibo.com/show?fid=1034:5162904367071275', label: '单人直拍' },
      { url: 'https://weibo.com/7509901544/5162924919230304', label: '单人直拍' }
    ]
  },
  {
    date: '2025.05.11',
    title: '世界树',
    links: [
      { url: 'https://weibo.com/5802147398/5165315344565525', label: '单人直拍' }
    ]
  },
  {
    date: '2025.05.14',
    title: '『MetaMates次元少女 』绮丽偶像日×IDOLREALM 上海v1 IN 瓦肆',
    links: [
      { url: 'https://weibo.com/7963695557/5166844508112200', label: '全景' },
      { url: 'https://weibo.com/7509901544/5166599301502595', label: '全景' },
      { url: 'https://weibo.com/5802147398/5166503407913258', label: '单人直拍' }
    ]
  },
  {
    date: '2025.05.24',
    title: '世界树',
    links: [
      { url: 'https://weibo.com/5802147398/5170114895023736', label: '全景' },
      { url: 'https://weibo.com/5802147398/5170010720832442', label: '单人直拍' }
    ]
  },
  {
    date: '2025.05.28',
    title: '『MetaMates次元少女』绮丽偶像日 x IDOLREALM 上海mini v1 IN 世界树',
    links: [
      { url: 'https://weibo.com/7963695557/5171590769936809', label: '全景' }
    ]
  },
  {
    date: '2025.06.07',
    title: '✞MetaMates  fes Neruko猫猫生诞祭✞',
    links: [
      { url: 'https://weibo.com/5802147398/5175059968690652', label: '次元部分单人fo' },
      { url: 'https://b23.tv/TIW64sg', label: 'B站合集' },
      { url: 'https://weibo.com/1719134744/5175633638589458', label: 'sp全景fo' },
      { url: 'https://weibo.com/5802147398/5175210930340275', label: 'sp全景fo' }
    ]
  },
  {
    date: '2025.06.11',
    title: '瓦肆',
    links: [
      { url: 'https://weibo.com/5802147398/5176520947795852', label: '单人直拍' }
    ]
  },
  {
    date: '2025.06.28',
    title: '世界树',
    links: [
      { url: 'https://weibo.com/5802147398/5183295090328310', label: '单人直拍' }
    ]
  },
  {
    date: '2025.06.29',
    title: '『MetaMates次元少女』 🥤Hand Pro 可乐节🥤 IN The BoXX',
    links: [
      { url: 'https://weibo.com/7963695557/5183721825374401', label: '全景' }
    ]
  },
  {
    date: '2025.07.05',
    title: '世界树',
    links: [
      { url: 'https://weibo.com/5802147398/5186297137991114', label: '单人直拍' }
    ]
  },
  {
    date: '2025.07.18',
    title: '正大',
    links: [
      { url: 'https://weibo.com/5802147398/5190889045229971', label: '单人直拍' }
    ]
  },
  {
    date: '2025.07.18',
    title: 'sif2025 梦之旅航',
    links: [
      { url: 'https://weibo.com/1018872051/5191527379763714', label: '单人直拍' }
    ]
  },
  {
    date: '2025.07.19',
    title: '『0nline』SIF 偶像节 2025 IN 上海 正大广场',
    links: [
      { url: 'https://weibo.com/7963695557/5190529245251910', label: '全景' },
      { url: 'https://b23.tv/37TFB07', label: 'B站全程录像' }
    ]
  }
];

// 生成 TreeSelect 数据
const treeData = focusEvents.map((event, idx) => ({
  label: `${event.date} ${event.title}`,
  value: String(idx),
  key: String(idx),
}));

export default function Focus() {
  const [selectedIdx, setSelectedIdx] = useState(null);

  const handleSelect = (value) => {
    setSelectedIdx(value);
    const id = `focus-timeline-item-${value}`;
    const node = document.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleWatch = (url) => {
    if (url.includes('weibo.com')) {
      handleWatchWeibo(url);
    } else if (url.includes('b23.tv')) {
      handleWatchB23(url);
    }
  };

  function handleWatchWeibo(url) {
    // 提取最后一个 / 后面的 id
    const id = url.substring(url.lastIndexOf('/') + 1);
    // 构造 API 地址
    const apiUrl = `https://weibo.com/ajax/statuses/show?id=${id}&locale=zh-CN&isGetLongText=true`;

    // 发起 GET 请求（使用axios代替fetch）
    axios.get(apiUrl)
      .then(response => {
        // 处理返回的数据
        // axios返回的数据在response.data
        console.log(response.data.page_info?.media_info);
      })
      .catch(error => {
        console.error('Error fetching Weibo data:', error);
      });
  }

  function handleWatchB23(url) {
    // 提取最后一个 / 后面的 id
    const id = url.substring(url.lastIndexOf('/') + 1);
    // 构造 API 地址
    const apiUrl = `https://api.b23.tv/video/${id}`;
  }

  // 背景图片列表
  const bgImgs = [
    '/assets/Home/CarouselImgs/1.JPG',
    '/assets/Home/CarouselImgs/2.JPG',
    '/assets/Home/CarouselImgs/3.JPG',
    '/assets/Home/CarouselImgs/4.JPG',
    '/assets/Home/CarouselImgs/5.JPG',
    '/assets/Home/CarouselImgs/6.JPG',
    '/assets/Home/CarouselImgs/7.JPG',
    '/assets/Home/CarouselImgs/8.JPG',
    '/assets/Home/CarouselImgs/9.JPG',
    '/assets/Home/CarouselImgs/10.JPG',
    '/assets/Home/CarouselImgs/11.JPG',
    '/assets/Home/CarouselImgs/12.JPG',
    '/assets/Home/CarouselImgs/13.JPG',
    '/assets/Home/CarouselImgs/14.JPG',
    '/assets/Home/CarouselImgs/15.JPG',
    '/assets/Home/CarouselImgs/16.JPG',
    '/assets/Home/CarouselImgs/17.JPG',
    '/assets/Home/CarouselImgs/18.JPG',
  ];
  // 生成三行图片，每行足够多，循环拼接避免空白
  const ROWS = 3;
  const COLS = 16; // 每行图片数量，保证动画期间不会出现空白
  const bgImgRows = [];
  for (let row = 0; row < ROWS; row++) {
    const rowImgs = [];
    for (let col = 0; col < COLS; col++) {
      const imgIdx = (col + row * 3) % bgImgs.length;
      rowImgs.push(
        <img
          key={`bgimg-${row}-${col}`}
          src={bgImgs[imgIdx]}
          className="focus-bg-img"
          alt="bg"
        />
      );
    }
    // 拼接一份，保证无缝
    for (let col = 0; col < COLS; col++) {
      const imgIdx = (col + row * 3) % bgImgs.length;
      rowImgs.push(
        <img
          key={`bgimg2-${row}-${col}`}
          src={bgImgs[imgIdx]}
          className="focus-bg-img"
          alt="bg"
        />
      );
    }
    bgImgRows.push(
      <div className="focus-bg-row" key={`row-${row}`}>{rowImgs}</div>
    );
  }

  return (
    <div style={{
      maxWidth: 700, margin: '0 auto', padding: 32,
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      position: 'relative',
      zIndex: 1,
      background: 'transparent',
      color: '#222', // 更深的字体颜色
      textShadow: '0 2px 8px #fff, 0 0 2px #fff', // 白色描边增强可读性
      fontSize: 20, // 默认字体放大
    }}>
      {/* 背景图片滑动层 */}
      <div className="focus-bg-slider">
        <div className="focus-bg-track">
          {bgImgRows}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <TreeSelect
          style={{ width: 320, fontSize: 22, color: '#222', fontWeight: 600, textShadow: '0 2px 8px #fff' }}
          treeData={treeData}
          placeholder="快速跳转到某场演出"
          onChange={handleSelect}
          filterTreeNode
          showClear
        />
      </div>
      <Typography.Title heading={3} style={{ marginBottom: 32, fontSize: 32, color: '#222', textShadow: '0 2px 8px #fff' }}>演出直拍/全景</Typography.Title>
      <Timeline mode="left">
        {focusEvents.map((event, idx) => (
          <Timeline.Item
            key={idx}
            time={event.date}
            type="default"
            dot={
              String(selectedIdx) === String(idx)
                ? <IconLikeHeart style={{ color: '#ae2af0', fontSize: 24 }} />
                : undefined
            }
          >
            <div id={`focus-timeline-item-${idx}`}>
              <Typography.Text strong style={{ fontSize: 24, color: '#222', textShadow: '0 2px 8px #fff' }}>{event.title}</Typography.Text>
              <div style={{ marginTop: 8 }}>
                {event.links.map((link, i) => (
                  <Button
                    key={i}
                    type="primary"
                    theme="light"
                    size="large"
                    style={{ marginRight: 8, marginBottom: 4, fontSize: 20, fontWeight: 600, textShadow: '0 2px 8px #fff' }}
                    onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                  >
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>

      {/* 返回顶部按钮，右下角固定 */}
      <BackTop style={{
        position: 'fixed',
        right: 40,
        bottom: 24,
        zIndex: 9999,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#ae2af0',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px #ae2af088',
        fontSize: 28,
        cursor: 'pointer',
      }}>
        <IconArrowUp />
      </BackTop>
    </div>
  );
}
