import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, Image, Row, Col, Statistic } from 'antd';
import type { Currency, Balance } from '../types';
import { fetchBalances, fetchCurrencies, fetchRates, getLatestRate } from '../services/api';

const { Title, Text } = Typography;

const WalletDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        const [currenciesData, ratesData, balancesData] = await Promise.all([
          fetchCurrencies(),
          fetchRates(),
          fetchBalances(),
        ]);

        setCurrencies(currenciesData);

        const balancesWithUsd = balancesData
          .map(balance => {
            const rate = getLatestRate(ratesData, balance.currency);
            const currencyInfo = currenciesData.find(c => c.symbol === balance.currency);
            return {
              ...balance,
              usdValue: balance.amount * rate,
              tokenDecimal: currencyInfo?.token_decimal || 8,
            };
          })
          .sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));

        setBalances(balancesWithUsd);
      } catch (err) {
        console.error('加载钱包数据时出错:', err);
        setError('加载数据时发生错误，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalUsdValue = balances.reduce((sum, balance) => sum + (balance.usdValue || 0), 0);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Card style={{ textAlign: 'center', margin: '24px' }}>
        <Text type="danger">{error}</Text>
      </Card>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Card style={{ marginBottom: '20px', textAlign: 'center' }}>
        <Statistic
          title={<Title level={5} style={{ color: 'gray', marginBottom: 0}}>总资产</Title>}
          value={totalUsdValue}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: '36px', color: '#1890ff' }}
          suffix="USD"
        />
      </Card>

      <Title level={4} style={{ marginBottom: '15px' }}>我的资产</Title>
      <List
        itemLayout="horizontal"
        dataSource={balances.filter(b => b.usdValue !== undefined && b.usdValue > 0)}
        renderItem={item => {
          const currencyInfo = currencies.find(c => c.symbol === item.currency);
          return (
            <List.Item
              style={{
                backgroundColor: 'white',
                marginBottom: '10px',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Row align="middle" style={{ width: '100%' }}>
                <Col flex="auto">
                  <Row align="middle" gutter={12}>
                    <Col>
                      {currencyInfo?.colorful_image_url && (
                        <Image
                          src={currencyInfo.colorful_image_url}
                          alt={item.currency}
                          style={{ width: 32, height: 32 }}
                          preview={false}
                        />
                      )}
                    </Col>
                    <Col>
                      <Text strong style={{ fontSize: '16px' }}>{currencyInfo?.name || item.currency}</Text>
                    </Col>
                  </Row>
                </Col>
                <Col style={{ textAlign: 'right' }}>
                  <Text strong style={{ fontSize: '16px', display: 'block' }}>
                    {item.amount.toFixed(item.tokenDecimal)} {item.currency}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    ${(item.usdValue || 0).toFixed(2)}
                  </Text>
                </Col>
              </Row>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default WalletDashboard;