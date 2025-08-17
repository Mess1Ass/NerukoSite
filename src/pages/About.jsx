import React, { useEffect, useState } from 'react';
import { Empty, Typography, Card, Button } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import axios from 'axios';
import config from '../config';
import './About.css';

// 数字滚动组件
const DigitalCounter = ({ number, digits = 10 }) => {
    const formatNumber = (num) => {
        const str = num.toString().padStart(digits, '0');
        return str.split('').map((digit, index) => (
            <span key={index} className="digit-cell">
                {digit}
            </span>
        ));
    };

    return (
        <div className="digital-counter">
            {formatNumber(number || 0)}
        </div>
    );
};

export default function About() {
    const [visitCount, setVisitCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchVisitCount = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${config.API_BASE_URL}/getipcnt?hostname=${encodeURIComponent(window.location.hostname)}`);
                if (response.status === 200) {
                    setVisitCount(response.data.data?.count || 0);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error('获取访问人数失败:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchVisitCount();
    }, []);

    return (
        <div
            className="about-scroll-container"
            style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
            }}
        >
            {/* 访问统计 Section */}
            <section className="visit-stats-section">
                <div className="visit-counter-container">
                    <div className="visit-counter-content">
                        <Typography.Text
                            type="secondary"
                            size="large"
                            style={{
                                display: 'block',
                                marginBottom: '30px',
                                textAlign: 'center',
                                fontSize: '24px',
                                fontWeight: '600',
                                color: '#333'
                            }}
                        >
                            网站访问统计
                        </Typography.Text>

                        {loading ? (
                            <div className="loading-container">
                                <Typography.Text type="secondary" size="large">
                                    加载中...
                                </Typography.Text>
                            </div>
                        ) : error ? (
                            <div className="error-container">
                                <Typography.Text type="danger" size="large">
                                    获取失败
                                </Typography.Text>
                            </div>
                        ) : (
                            <div className="counter-display">
                                <DigitalCounter number={visitCount} digits={10} />
                                <Typography.Text
                                    type="secondary"
                                    size="medium"
                                    style={{
                                        display: 'block',
                                        marginTop: '25px',
                                        textAlign: 'center',
                                        fontSize: '18px',
                                        color: '#666'
                                    }}
                                >
                                    总访问次数
                                </Typography.Text>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 友链 Section */}
            <section className="friends-links-section">
                <div className="friends-links-container">
                    <div className="friends-links-content">
                        <Typography.Title
                            heading={2}
                            style={{
                                marginBottom: '40px',
                                textAlign: 'center',
                                color: '#333',
                                fontWeight: '600'
                            }}
                        >
                            友情链接
                        </Typography.Title>

                        <div className="friends-links-grid">

                            {/* Natsumi 友链 */}
                            <Card className="friend-link-card special-friend">
                                <div className="friend-link-content">
                                    <div className="friend-link-avatar">
                                        <img 
                                            src="/assets/About/NatsumiAvatar.JPG" 
                                            alt="Natsumi Avatar" 
                                            className="friend-link-avatar-img"
                                        />
                                    </div>
                                    <div className="friend-link-info">
                                        <Typography.Text strong style={{ fontSize: '16px' }}>
                                            夏沫安利站
                                        </Typography.Text>
                                    </div>
                                    <Button 
                                        type="tertiary" 
                                        size="small"
                                        className="visit-button"
                                        onClick={() => window.open('https://natsumi.chikaaidoru.cn/home', '_blank', 'noopener,noreferrer')}
                                    >
                                        访问
                                    </Button>
                                </div>
                            </Card>

                            {/* <Card className="friend-link-card">
                                <div className="friend-link-content">
                                    <div className="friend-link-avatar">
                                        <div className="avatar-placeholder">链</div>
                                    </div>
                                    <div className="friend-link-info">
                                        <Typography.Text strong style={{ fontSize: '16px' }}>
                                            另一个友链
                                        </Typography.Text>
                                        <Typography.Text type="secondary" size="small">
                                            这是另一个示例友链
                                        </Typography.Text>
                                    </div>
                                    <Button 
                                        type="tertiary" 
                                        size="small"
                                        className="visit-button"
                                    >
                                        访问
                                    </Button>
                                </div>
                            </Card> */}

                            {/* 添加更多友链的占位符 */}
                            {/* <div className="add-friend-link">
                                <Card 
                                    className="friend-link-card add-card"
                                    onClick={() => {
                                        // 可以在这里添加联系信息或者跳转到联系页面
                                        const contactInfo = "如果您想添加友链，请联系我：\n\n可以通过以下方式联系：\n• 在 GitHub 上提交 Issue\n• 发送邮件到我的邮箱\n• 通过社交媒体联系我\n\n期待与您的合作！";
                                        alert(contactInfo);
                                    }}
                                >
                                    <div className="add-content">
                                        <Typography.Text type="secondary" size="large">
                                            +
                                        </Typography.Text>
                                        <Typography.Text type="secondary" size="small">
                                            添加友链
                                        </Typography.Text>
                                    </div>
                                </Card>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}