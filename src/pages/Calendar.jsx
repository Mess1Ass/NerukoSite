import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, Modal, Input, Toast, Popconfirm, DatePicker } from '@douyinfe/semi-ui';
import { IconEdit, IconDelete, IconPlus } from '@douyinfe/semi-icons';
import axios from 'axios';
import config, { getCurrentDomainConfig } from '../config';
import './Calendar.css';

export default function Calendar() {
    const [showLogs, setShowLogs] = useState([]);
    const [earliestShow, setEarliestShow] = useState(null);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingShow, setEditingShow] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        location: ''
    });

    // 全部演出记录模态框状态
    const [allShowsModalVisible, setAllShowsModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [addFormData, setAddFormData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        location: ''
    });
    const [addLoading, setAddLoading] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // 获取当前域名配置
    const domainConfig = getCurrentDomainConfig();

    // 刷新演出数据的方法
    const refreshShowData = async () => {
        try {
            const allShowsResponse = await axios.get(`${config.API_BASE_URL}/getShowLogs`);
            if (allShowsResponse.status === 200) {
                setShowLogs(allShowsResponse.data || []);
            }

            const earliestResponse = await axios.get(`${config.API_BASE_URL}/getEarliestShowLog`);
            if (earliestResponse.status === 200) {
                setEarliestShow(earliestResponse.data || null);
            }
        } catch (error) {
            console.error('刷新演出数据失败:', error);
        }
    };

    // 获取演出数据
    useEffect(() => {
        const fetchShowData = async () => {
            try {
                setLoading(true);
                await refreshShowData();
                    } catch (error) {
            console.error('获取演出数据失败:', error);
            const errorMessage = error.response?.data?.error || '网络错误';
            Toast.error('获取演出数据失败: ' + errorMessage);
        } finally {
            setLoading(false);
        }
        };

        fetchShowData();
    }, []);

    // 倒计时计算
    useEffect(() => {
        if (!earliestShow || !earliestShow.startTime) return;

        const calculateCountdown = () => {
            const now = new Date();
            const showDate = new Date(earliestShow.startTime);
            const diff = showDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setCountdown({ days, hours, minutes, seconds });
            } else {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateCountdown();
        const timer = setInterval(calculateCountdown, 1000);

        return () => clearInterval(timer);
    }, [earliestShow]);

    // 格式化日期
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 编辑演出
    const handleEdit = (show) => {
        setEditingShow(show);
        setEditFormData({
            title: show.title || '',
            startTime: show.startTime || '',
            endTime: show.endTime || '',
            location: show.location || ''
        });
        setEditModalVisible(true);
    };

    // 检查当天是否已存在演出
    const checkSameDayShow = (startTime, excludeId = null) => {
        const targetDate = new Date(parseInt(startTime));
        const targetYear = targetDate.getFullYear();
        const targetMonth = targetDate.getMonth();
        const targetDay = targetDate.getDate();

        return showLogs.some(show => {
            // 排除当前编辑的演出
            if (excludeId && show._id === excludeId) {
                return false;
            }

            const showDate = new Date(parseInt(show.startTime));
            return showDate.getFullYear() === targetYear &&
                   showDate.getMonth() === targetMonth &&
                   showDate.getDate() === targetDay;
        });
    };

    // 保存编辑
    const handleEditSave = async () => {
        try {
            if (!editFormData.title || !editFormData.startTime) {
                Toast.warning('请填写演出标题和开始时间');
                return;
            }

            // 检查开始时间不能大于结束时间
            if (editFormData.endTime && parseInt(editFormData.startTime) >= parseInt(editFormData.endTime)) {
                Toast.warning('开始时间不能大于或等于结束时间');
                return;
            }

            // 检查当天是否已存在其他演出
            if (checkSameDayShow(editFormData.startTime, editingShow._id)) {
                setPendingAction({
                    type: 'edit',
                    data: {
                        _id: editingShow._id,
                        title: editFormData.title,
                        startTime: editFormData.startTime,
                        endTime: editFormData.endTime,
                        location: editFormData.location
                    }
                });
                setConfirmModalVisible(true);
                return;
            }

            await performEditSave({
                _id: editingShow._id,
                title: editFormData.title,
                startTime: editFormData.startTime,
                endTime: editFormData.endTime,
                location: editFormData.location
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || '网络错误';
            Toast.error('更新失败: ' + errorMessage);
        }
    };

    // 执行编辑保存
    const performEditSave = async (data) => {
        try {
            const response = await axios.post(`${config.API_BASE_URL}/updateShowLog`, data);

            if (response.status === 200) {
                Toast.success('更新成功');
                setEditModalVisible(false);
                await refreshShowData();
            } else {
                Toast.error('更新失败');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || '网络错误';
            Toast.error('更新失败: ' + errorMessage);
        }
    };

    // 删除演出
    const handleDelete = async (show) => {
        try {
            const response = await axios.post(`${config.API_BASE_URL}/deleteShowLog?id=${show._id}`);

            if (response.status === 200) {
                Toast.success('删除成功');
                await refreshShowData();
            } else {
                Toast.error('删除失败');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || '网络错误';
            Toast.error('删除失败: ' + errorMessage);
        }
    };

    // 新增演出
    const handleAdd = async () => {
        try {
            setAddLoading(true);
            if (!addFormData.title || !addFormData.startTime) {
                Toast.warning('请填写演出标题和开始时间');
                return;
            }

            // 检查开始时间不能大于结束时间
            if (addFormData.endTime && parseInt(addFormData.startTime) >= parseInt(addFormData.endTime)) {
                Toast.warning('开始时间不能大于或等于结束时间');
                setAddLoading(false);
                return;
            }

            // 检查当天是否已存在演出
            if (checkSameDayShow(addFormData.startTime)) {
                setPendingAction({
                    type: 'add',
                    data: {
                        title: addFormData.title,
                        startTime: addFormData.startTime,
                        endTime: addFormData.endTime,
                        location: addFormData.location
                    }
                });
                setConfirmModalVisible(true);
                setAddLoading(false);
                return;
            }

            await performAdd({
                title: addFormData.title,
                startTime: addFormData.startTime,
                endTime: addFormData.endTime,
                location: addFormData.location
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || '网络错误';
            Toast.error('添加失败: ' + errorMessage);
        } finally {
            setAddLoading(false);
        }
    };

    // 执行新增
    const performAdd = async (data) => {
        try {
            setAddLoading(true);
            const response = await axios.post(`${config.API_BASE_URL}/insertShowLog`, data);

            if (response.status === 200) {
                Toast.success('添加成功');
                setAddModalVisible(false);
                setAddFormData({ title: '', startTime: '', endTime: '', location: '' });
                await refreshShowData();
            } else {
                Toast.error('添加失败');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || '网络错误';
            Toast.error('添加失败: ' + errorMessage);
        } finally {
            setAddLoading(false);
        }
    };

    // 按月份分组演出记录
    const groupShowsByMonth = (shows) => {
        const groups = {};
        shows.forEach(show => {
            const date = new Date(parseInt(show.startTime));
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const key = `${year}-${month.toString().padStart(2, '0')}`;
            
            if (!groups[key]) {
                groups[key] = {
                    year,
                    month,
                    label: `${year}年${month}月`,
                    shows: []
                };
            }
            groups[key].shows.push(show);
        });
        
        // 对每个月份内的演出按时间从晚到早排序
        Object.values(groups).forEach(group => {
            group.shows.sort((a, b) => {
                const dateA = new Date(parseInt(a.startTime));
                const dateB = new Date(parseInt(b.startTime));
                return dateB - dateA; // 从晚到早排序
            });
        });
        
        // 按时间倒序排列月份
        return Object.values(groups).sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });
    };

    // 格式化月份标签
    const formatMonthLabel = (year, month) => {
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                           '七月', '八月', '九月', '十月', '十一月', '十二月'];
        return `${year}年${monthNames[month - 1]}`;
    };

    if (loading) {
        return (
            <div className="calendar-container">
                <div className="calendar-loading">
                    <Typography.Text>加载中...</Typography.Text>
                </div>
            </div>
        );
    }

    return (
        <div className="calendar-container"
            style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}>
            {/* 右上角按钮 */}
            <div className="calendar-header">
                <Button
                    type="tertiary"
                    theme="light"
                    size="large"
                    onClick={() => setAllShowsModalVisible(true)}
                    className="view-all-shows-btn"
                >
                    查看全部演出记录
                </Button>
            </div>

            {/* 倒计时区域 */}
            <div className="countdown-section">
                <Typography.Title heading={2} className="countdown-title">
                    距离下一次见面 还有
                </Typography.Title>

                {earliestShow ? (
                    <>
                        <div className="countdown-display">
                            <div className="countdown-item">
                                <div className="countdown-number">{countdown.days}</div>
                                <div className="countdown-label">天</div>
                            </div>
                            <div className="countdown-item">
                                <div className="countdown-number">{countdown.hours}</div>
                                <div className="countdown-label">时</div>
                            </div>
                            <div className="countdown-item">
                                <div className="countdown-number">{countdown.minutes}</div>
                                <div className="countdown-label">分</div>
                            </div>
                            <div className="countdown-item">
                                <div className="countdown-number">{countdown.seconds}</div>
                                <div className="countdown-label">秒</div>
                            </div>
                        </div>

                        {/* 演出信息卡片 */}
                        <Card className="show-info-card">
                            <div className="show-info-header">
                                <Typography.Title heading={3} className="show-title">
                                    {earliestShow.title}
                                </Typography.Title>
                            </div>

                            <div className="show-info-content">
                                <div className="show-info-item">
                                    <div className="info-icon">📅</div>
                                    <div className="info-content">
                                        <Typography.Text className="info-label">开始时间</Typography.Text>
                                        <Typography.Text className="info-value">{formatDate(earliestShow.startTime)}</Typography.Text>
                                    </div>
                                </div>
                                {earliestShow.endTime && (
                                    <div className="show-info-item">
                                        <div className="info-icon">⏰</div>
                                        <div className="info-content">
                                            <Typography.Text className="info-label">结束时间</Typography.Text>
                                            <Typography.Text className="info-value">{formatDate(earliestShow.endTime)}</Typography.Text>
                                        </div>
                                    </div>
                                )}
                                {earliestShow.location && (
                                    <div className="show-info-item">
                                        <div className="info-icon">📍</div>
                                        <div className="info-content">
                                            <Typography.Text className="info-label">演出地点</Typography.Text>
                                            <Typography.Text className="info-value">{earliestShow.location}</Typography.Text>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </>
                ) : (
                    <div className="no-show-message">
                        <Typography.Text>暂无即将到来的演出</Typography.Text>
                    </div>
                )}
            </div>

            {/* 全部演出记录模态框 */}
            <Modal
                title="全部演出记录"
                visible={allShowsModalVisible}
                onCancel={() => setAllShowsModalVisible(false)}
                footer={null}
                width={800}
                className="all-shows-modal"
            >
                <div className="all-shows-content">
                    <div className="all-shows-header">
                        <Typography.Title heading={4}>演出列表</Typography.Title>
                        {domainConfig.editorMode && (
                            <Button
                                type="primary"
                                icon={<IconPlus />}
                                onClick={() => setAddModalVisible(true)}
                                className="add-show-btn"
                            >
                                新增演出
                            </Button>
                        )}
                    </div>

                    <div className="shows-list">
                        {showLogs.length > 0 ? (
                            groupShowsByMonth([...showLogs]).map((group, groupIndex) => (
                                <div key={groupIndex} className="show-group">
                                    <div className="show-group-header">
                                        <Typography.Title heading={5} className="show-group-title">
                                            {formatMonthLabel(group.year, group.month)}
                                        </Typography.Title>
                                        <Typography.Text className="show-group-count">
                                            {group.shows.length}场演出
                                        </Typography.Text>
                                    </div>
                                    
                                    <div className="show-group-content">
                                        {group.shows.map((show, index) => (
                                            <Card key={show._id || index} className="show-item-card">
                                                <div className="show-item-header">
                                                    <Typography.Title heading={5} className="show-item-title">
                                                        {show.title}
                                                    </Typography.Title>
                                                    {domainConfig.editorMode && (
                                                        <div className="show-item-actions">
                                                            <Button
                                                                type="tertiary"
                                                                size="small"
                                                                icon={<IconEdit />}
                                                                onClick={() => handleEdit(show)}
                                                                className="edit-btn"
                                                            >
                                                                修改
                                                            </Button>
                                                            <Popconfirm
                                                                title="确定要删除这场演出吗？"
                                                                onConfirm={() => handleDelete(show)}
                                                            >
                                                                <Button
                                                                    type="danger"
                                                                    size="small"
                                                                    icon={<IconDelete />}
                                                                    className="delete-btn"
                                                                >
                                                                    删除
                                                                </Button>
                                                            </Popconfirm>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="show-item-content">
                                                    <div className="show-item-info">
                                                        <div className="info-icon">📅</div>
                                                        <div className="info-content">
                                                            <Typography.Text className="info-label">开始时间</Typography.Text>
                                                            <Typography.Text className="info-value">{formatDate(show.startTime)}</Typography.Text>
                                                        </div>
                                                    </div>
                                                    {show.endTime && (
                                                        <div className="show-item-info">
                                                            <div className="info-icon">⏰</div>
                                                            <div className="info-content">
                                                                <Typography.Text className="info-label">结束时间</Typography.Text>
                                                                <Typography.Text className="info-value">{formatDate(show.endTime)}</Typography.Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {show.location && (
                                                        <div className="show-item-info">
                                                            <div className="info-icon">📍</div>
                                                            <div className="info-content">
                                                                <Typography.Text className="info-label">演出地点</Typography.Text>
                                                                <Typography.Text className="info-value">{show.location}</Typography.Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-shows-message">
                                <div className="no-shows-icon">🎭</div>
                                <Typography.Text>暂无演出记录</Typography.Text>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* 新增演出模态框 */}
            <Modal
                title="新增演出"
                visible={addModalVisible}
                onCancel={() => {
                    setAddModalVisible(false);
                    setAddFormData({ title: '', startTime: '', endTime: '', location: '' });
                }}
                footer={null}
                width={500}
            >
                <div className="edit-form">
                    <div className="form-item">
                        <label className="form-label">演出标题 *</label>
                        <Input
                            placeholder="请输入演出标题"
                            value={addFormData.title}
                            onChange={(value) => setAddFormData({ ...addFormData, title: value })}
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">开始时间 *</label>
                        <DatePicker
                            type="dateTime"
                            timePickerOpts={{
                                scrollItemProps: { mode: "wheel", cycled: true }
                            }}
                            value={addFormData.startTime ? new Date(parseInt(addFormData.startTime)) : null}
                            onChange={(date) => {
                                if (date) {
                                    setAddFormData({
                                        ...addFormData,
                                        startTime: date.getTime().toString()
                                    });
                                } else {
                                    setAddFormData({
                                        ...addFormData,
                                        startTime: ''
                                    });
                                }
                            }}
                            placeholder="请选择开始时间"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">结束时间</label>
                        <DatePicker
                            type="dateTime"
                            timePickerOpts={{
                                scrollItemProps: { mode: "wheel", cycled: true }
                            }}
                            value={addFormData.endTime ? new Date(parseInt(addFormData.endTime)) : null}
                            onChange={(date) => {
                                if (date) {
                                    setAddFormData({
                                        ...addFormData,
                                        endTime: date.getTime().toString()
                                    });
                                } else {
                                    setAddFormData({
                                        ...addFormData,
                                        endTime: ''
                                    });
                                }
                            }}
                            placeholder="请选择结束时间"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">演出地点</label>
                        <Input
                            placeholder="请输入演出地点"
                            value={addFormData.location}
                            onChange={(value) => setAddFormData({ ...addFormData, location: value })}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            onClick={() => {
                                setAddModalVisible(false);
                                setAddFormData({ title: '', startTime: '', endTime: '', location: '' });
                            }}
                        >
                            取消
                        </Button>
                        <Button type="primary" onClick={handleAdd} loading={addLoading}>
                            保存
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* 编辑模态框 */}
            <Modal
                title="编辑演出信息"
                visible={editModalVisible}
                onCancel={() => {
                    setEditModalVisible(false);
                    setEditingShow(null);
                    setEditFormData({ title: '', startTime: '', endTime: '', location: '' });
                }}
                footer={null}
                width={500}
            >
                <div className="edit-form">
                    <div className="form-item">
                        <label className="form-label">演出标题 *</label>
                        <Input
                            placeholder="请输入演出标题"
                            value={editFormData.title}
                            onChange={(value) => setEditFormData({ ...editFormData, title: value })}
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">开始时间 *</label>
                        <DatePicker
                            type="dateTime"
                            timePickerOpts={{
                                scrollItemProps: { mode: "wheel", cycled: true }
                            }}
                            value={editFormData.startTime ? new Date(parseInt(editFormData.startTime)) : null}
                            onChange={(date) => {
                                if (date) {
                                    setEditFormData({
                                        ...editFormData,
                                        startTime: date.getTime().toString()
                                    });
                                } else {
                                    setEditFormData({
                                        ...editFormData,
                                        startTime: ''
                                    });
                                }
                            }}
                            placeholder="请选择开始时间"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">结束时间</label>
                        <DatePicker
                            type="dateTime"
                            timePickerOpts={{
                                scrollItemProps: { mode: "wheel", cycled: true }
                            }}
                            value={editFormData.endTime ? new Date(parseInt(editFormData.endTime)) : null}
                            onChange={(date) => {
                                if (date) {
                                    setEditFormData({
                                        ...editFormData,
                                        endTime: date.getTime().toString()
                                    });
                                } else {
                                    setEditFormData({
                                        ...editFormData,
                                        endTime: ''
                                    });
                                }
                            }}
                            placeholder="请选择结束时间"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div className="form-item">
                        <label className="form-label">演出地点</label>
                        <Input
                            placeholder="请输入演出地点"
                            value={editFormData.location}
                            onChange={(value) => setEditFormData({ ...editFormData, location: value })}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            onClick={() => {
                                setEditModalVisible(false);
                                setEditingShow(null);
                                setEditFormData({ title: '', startTime: '', endTime: '', location: '' });
                            }}
                        >
                            取消
                        </Button>
                        <Button type="primary" onClick={handleEditSave}>
                            保存
                        </Button>
                                         </div>
                 </div>
             </Modal>

             {/* 确认模态框 */}
             <Modal
                 title="确认操作"
                 visible={confirmModalVisible}
                 onCancel={() => {
                     setConfirmModalVisible(false);
                     setPendingAction(null);
                 }}
                 footer={[
                     <Button key="cancel" onClick={() => {
                         setConfirmModalVisible(false);
                         setPendingAction(null);
                     }}>
                         取消
                     </Button>,
                     <Button key="confirm" type="primary" onClick={async () => {
                         setConfirmModalVisible(false);
                         if (pendingAction) {
                             // 检查开始时间不能大于结束时间
                             if (pendingAction.data.endTime && parseInt(pendingAction.data.startTime) >= parseInt(pendingAction.data.endTime)) {
                                 Toast.warning('开始时间不能大于或等于结束时间');
                                 setPendingAction(null);
                                 return;
                             }
                             
                             if (pendingAction.type === 'edit') {
                                 await performEditSave(pendingAction.data);
                             } else if (pendingAction.type === 'add') {
                                 await performAdd(pendingAction.data);
                             }
                             setPendingAction(null);
                         }
                     }}>
                         确认继续
                     </Button>
                 ]}
                 width={400}
             >
                 <div style={{ padding: '20px 0' }}>
                     <Typography.Text>
                         当天已存在演出，确定要继续添加/修改吗？
                     </Typography.Text>
                 </div>
             </Modal>
         </div>
     );
 }
