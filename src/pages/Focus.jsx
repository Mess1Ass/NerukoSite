import React, { useState, useEffect } from "react";
import {
  Timeline, Typography, Button, TreeSelect, BackTop,
  Modal, Form, Input, Space, Toast, Popconfirm
} from "@douyinfe/semi-ui";
import { IconLikeHeart, IconArrowUp, IconPlus, IconMinus, IconEdit, IconDelete } from "@douyinfe/semi-icons";
import axios from "axios";
import "./Focus.css";
import config, { getCurrentDomainConfig } from '../config';
import FoVideo from '../components/FoVideo';




export default function Focus() {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    title: ""
  });
  const [links, setLinks] = useState([{ url: "", label: "" }]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [focusEvents, setFocusEvents] = useState([]);

  // 编辑相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({ date: "", title: "" });
  const [editLinks, setEditLinks] = useState([{ url: "", label: "" }]);
  const [editLoading, setEditLoading] = useState(false);

  // 获取当前域名配置
  const domainConfig = getCurrentDomainConfig();

  useEffect(() => {
    axios.get(`${config.API_BASE_URL}/getAll`).then((response) => {
      if (response.status === 200) {
        // 按日期排序：从早到晚
        const sortedData = response.data.data.sort((a, b) => {
          const dateA = new Date(a.date.replace(/\./g, '-'));
          const dateB = new Date(b.date.replace(/\./g, '-'));
          return dateA - dateB;
        });
        setFocusEvents(sortedData);
      }
      else {
        Toast.error("获取演出记录失败");
      }
    });
  }, []);


  // 生成 TreeSelect 数据
  const treeData = React.useMemo(() => {
    return focusEvents.map((event, idx) => ({
      label: `${event.date} ${event.title}`,
      value: String(idx),
      key: String(idx),
    }));
  }, [focusEvents]);

  const handleSelect = (value) => {
    setSelectedIdx(value);
    const id = `focus-timeline-item-${value}`;
    const node = document.getElementById(id);
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

    // 视频播放相关状态
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);

  const [currentUrl, setCurrentUrl] = useState('');

  const handleWatch = (url) => {
    setCurrentUrl(url);
    setVideoModalVisible(true);
  };


  // 添加链接输入框
  const addLink = () => {
    setLinks([...links, { url: "", label: "" }]);
  };

  // 删除链接输入框
  const removeLink = (index) => {
    if (links.length > 1) {
      const newLinks = links.filter((_, i) => i !== index);
      setLinks(newLinks);
    }
  };

  // 更新链接
  const updateLink = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  // 编辑链接相关函数
  const updateEditLink = (index, field, value) => {
    const newLinks = [...editLinks];
    newLinks[index][field] = value;
    setEditLinks(newLinks);
  };

  const addEditLink = () => {
    setEditLinks([...editLinks, { url: "", label: "" }]);
  };

  const removeEditLink = (index) => {
    if (editLinks.length > 1) {
      const newLinks = editLinks.filter((_, i) => i !== index);
      setEditLinks(newLinks);
    }
  };

  // 打开编辑模态框
  // 时间戳转换函数
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditFormData({
      date: event.date,
      title: event.title,
      updateTime: event.updateTime
    });
    setEditLinks([...event.links]);
    setEditModalVisible(true);
  };

  // 保存编辑
  const handleEditSave = async () => {
    setEditLoading(true);
    try {
      if (!editFormData.date || !editFormData.title) {
        Toast.warning("请填写日期和标题");
        return;
      }

      const validLinks = editLinks.filter(link => link.url && link.label);
      if (validLinks.length === 0) {
        Toast.warning("请至少添加一条链接");
        return;
      }

      const data = {
        _id: editingEvent._id, // 假设后端需要ID来更新
        date: editFormData.date,
        title: editFormData.title,
        links: validLinks
      };


      const response = await axios.post(`${config.API_BASE_URL}/updatefolink`, data);

      if (response.status === 200) {
        Toast.success("更新成功");
        setEditModalVisible(false);
        // 刷新数据
        window.location.reload();
      } else {
        Toast.error("更新失败: " + (response.data.error || "未知错误"));
      }
    } catch (error) {
      Toast.error("更新失败: " + (error.response?.data?.error || "网络错误"));
    } finally {
      setEditLoading(false);
    }
  };

  // 删除演出记录
  const handleDelete = async (event) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/deletefolink?id=${event._id}`);
      if (response.status === 200) {
        Toast.success("删除成功");
        // 刷新数据
        window.location.reload();
      } else {
        Toast.error("删除失败: " + (response.data.error || "未知错误"));
      }
    } catch (error) {
      Toast.error("删除失败: " + (error.response?.data?.error || "网络错误"));
    }
  };

  // 保存新演出记录
  const handleSave = async () => {
    setSaveLoading(true);
    try {
      // 验证表单数据
      if (!formData.date || !formData.title) {
        Toast.warning("请填写日期和标题");
        return;
      }

      // 过滤有效的链接（有URL和标签的链接）
      const validLinks = links.filter(link => link.url && link.label);

      // 确保至少有一条链接数据
      if (validLinks.length === 0) {
        Toast.warning("请至少添加一条链接");
        return;
      }

      const data = {
        date: formData.date,
        title: formData.title,
        links: validLinks
      };

      const response = await axios.post(`${config.API_BASE_URL}/insertfolink`, data);

      if (response.status === 200) {
        setSaveLoading(false);
        Toast.success("保存成功");
        console.log(response.data);

        // 关闭模态框并重置表单
        setModalVisible(false);
        setFormData({ date: "", title: "" });
        setLinks([{ url: "", label: "" }]);

        // 可以在这里刷新页面或更新数据
        window.location.reload();
      } else {
        Toast.error("保存失败: " + (response.data.error || "未知错误"));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // 服务器返回错误响应
        Toast.error("保存失败: " + (error.response.data.error || "服务器错误"));
      } else if (error.response) {
        // 服务器返回错误但没有data
        Toast.error("保存失败: 服务器错误");
      } else {
        // 网络错误或其他错误
        Toast.error("保存失败: 网络连接错误");
      }
    }
  };

  // 背景图片列表 - 自动生成所有图片路径
  const generateBgImgs = () => {
    const imgCount = 12; // 根据实际图片数量设置
    const bgImgs = [];
    for (let i = 1; i <= imgCount; i++) {
      bgImgs.push(`/assets/Home/CarouselImgs/${i}.JPG`);
    }
    return bgImgs;
  };

  const bgImgs = generateBgImgs();
  // 生成三行图片，每行足够多，循环拼接避免空白
  const bgImgRows = React.useMemo(() => {
    const ROWS = 3;
    const COLS = 16; // 每行图片数量，保证动画期间不会出现空白
    const rows = [];
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
      rows.push(
        <div className="focus-bg-row" key={`row-${row}`}>
          {rowImgs}
        </div>
      );
    }
    return rows;
  }, [bgImgs]);

  return (
    <div className="focus-container">
      {/* 背景图片滑动层 */}
      <div className="focus-bg-slider">
        <div className="focus-bg-track">{bgImgRows}</div>
      </div>
      <div className="focus-toolbar">
        <TreeSelect
          className="focus-treeselect"
          treeData={treeData}
          placeholder="快速跳转到某场演出"
          onChange={handleSelect}
          filterTreeNode
          showClear
        />
        {domainConfig.editorMode && (
          <Button
            type="tertiary"
            theme="light"
            size="large"
            className="focus-add-button"
            onClick={() => setModalVisible(true)}
          >
            添加演出
          </Button>
        )}
      </div>
      <Typography.Title heading={3} className="focus-title">
        演出直拍/全景
      </Typography.Title>
      <Timeline mode="left">
        {focusEvents.map((event, idx) => (
          <Timeline.Item
            key={idx}
            time={event.date}
            type="default"
            dot={
              String(selectedIdx) === String(idx) ? (
                <IconLikeHeart style={{ color: "#ae2af0", fontSize: 24 }} />
              ) : undefined
            }
          >
            <div id={`focus-timeline-item-${idx}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Typography.Title heading={4} className="focus-timeline-text" style={{ fontWeight: '900 !important', margin: 0 }}>
                  {event.title}
                </Typography.Title>
                {domainConfig.editorMode && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      type="tertiary"
                      theme="light"
                      size="small"
                      icon={<IconEdit />}
                      onClick={() => handleEdit(event)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定要删除这个演出记录吗？"
                      onConfirm={() => handleDelete(event)}
                    >
                      <Button
                        type="danger"
                        theme="light"
                        size="small"
                        icon={<IconDelete />}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 8 }}>
                {event.links.map((link, i) => (
                  <Button
                    key={i}
                    type="primary"
                    theme="light"
                    size="large"
                    className="focus-link-button"
                    // onClick={() => window.open(link.url, "_blank", "noopener,noreferrer") }
                    onClick={() => handleWatch(link.url)}
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
      <BackTop className="focus-backtop">
        <IconArrowUp />
      </BackTop>

      {/* 添加演出模态框 */}
      <Modal
        title="添加新演出记录"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFormData({ date: "", title: "" });
          setLinks([{ url: "", label: "" }]);
        }}
        footer={null}
        width={600}
        className="focus-modal"
      >
        <div className="focus-modal-content">
          <div className="focus-form-item">
            <label className="focus-form-label">
              日期 *
            </label>
            <Input
              placeholder="格式：2025.01.01"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
              className="focus-form-input"
            />
          </div>

          <div className="focus-form-item">
            <label className="focus-form-label">
              演出标题 *
            </label>
            <Input
              placeholder="请输入演出标题"
              value={formData.title}
              onChange={(value) => setFormData({ ...formData, title: value })}
              className="focus-form-input"
            />
          </div>

          <div className="focus-form-item">
            <label className="focus-form-label">
              链接列表
            </label>
            <div className="focus-links-container">
              {links.map((link, index) => (
                <div key={index} className="focus-link-item">
                  <Input
                    placeholder="链接标签（如：单人直拍）"
                    value={link.label}
                    onChange={(value) => updateLink(index, "label", value)}
                    className="focus-link-label-input"
                  />
                  <Input
                    placeholder="链接URL"
                    value={link.url}
                    onChange={(value) => updateLink(index, "url", value)}
                    className="focus-link-url-input"
                  />
                  {links.length > 1 && (
                    <Button
                      type="danger"
                      icon={<IconMinus />}
                      onClick={() => removeLink(index)}
                      className="focus-link-remove-button"
                    />
                  )}
                </div>
              ))}
              <Button
                icon={<IconPlus />}
                onClick={addLink}
                className="focus-add-link-button"
              >
                添加链接
              </Button>
            </div>
          </div>

          <div className="focus-modal-footer">
            <Button
              onClick={() => {
                setModalVisible(false);
                setFormData({ date: "", title: "" });
                setLinks([{ url: "", label: "" }]);
              }}
              className="focus-cancel-button"
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              className="focus-save-button"
              loading={saveLoading}
            >
              保存
            </Button>
          </div>
        </div>
      </Modal>

      {/* 编辑演出记录模态框 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>编辑演出记录</span>
            {editFormData.updateTime && (
              <span style={{ 
                fontSize: '12px', 
                color: '#666', 
                fontWeight: 'normal',
                marginLeft: '10px'
              }}>
                上次修改：{formatTimestamp(editFormData.updateTime)}
              </span>
            )}
          </div>
        }
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingEvent(null);
          setEditFormData({ date: "", title: "" });
          setEditLinks([{ url: "", label: "" }]);
        }}
        footer={null}
        width={600}
        className="focus-modal"
      >
        <div className="focus-modal-content">
          <div className="focus-form-item">
            <label className="focus-form-label">
              日期 *
            </label>
            <Input
              placeholder="格式：2025.01.01"
              value={editFormData.date}
              onChange={(value) => setEditFormData({ ...editFormData, date: value })}
              className="focus-form-input"
            />
          </div>

          <div className="focus-form-item">
            <label className="focus-form-label">
              演出标题 *
            </label>
            <Input
              placeholder="请输入演出标题"
              value={editFormData.title}
              onChange={(value) => setEditFormData({ ...editFormData, title: value })}
              className="focus-form-input"
            />
          </div>

          <div className="focus-form-item">
            <label className="focus-form-label">
              链接列表
            </label>
            <div className="focus-links-container">
              {editLinks.map((link, index) => (
                <div key={index} className="focus-link-item">
                  <Input
                    placeholder="链接标签（如：单人直拍）"
                    value={link.label}
                    onChange={(value) => updateEditLink(index, "label", value)}
                    className="focus-link-label-input"
                  />
                  <Input
                    placeholder="链接URL"
                    value={link.url}
                    onChange={(value) => updateEditLink(index, "url", value)}
                    className="focus-link-url-input"
                  />
                  {editLinks.length > 1 && (
                    <Button
                      type="danger"
                      icon={<IconMinus />}
                      onClick={() => removeEditLink(index)}
                      className="focus-link-remove-button"
                    />
                  )}
                </div>
              ))}
              <Button
                icon={<IconPlus />}
                onClick={addEditLink}
                className="focus-add-link-button"
              >
                添加链接
              </Button>
            </div>
          </div>



          <div className="focus-modal-footer">
            <Button
              onClick={() => {
                setEditModalVisible(false);
                setEditingEvent(null);
                setEditFormData({ date: "", title: "" });
                setEditLinks([{ url: "", label: "" }]);
              }}
              className="focus-cancel-button"
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleEditSave}
              className="focus-save-button"
              loading={editLoading}
            >
              更新
            </Button>
          </div>
        </div>
      </Modal>

      {/* 视频播放组件 */}
      <FoVideo
        visible={videoModalVisible}
        onClose={(visible) => setVideoModalVisible(visible)}
        videoData={videoData}
        videoLoading={videoLoading}
        onVideoDataChange={setVideoData}
        currentUrl={currentUrl}
      />
    </div>
  );
}
