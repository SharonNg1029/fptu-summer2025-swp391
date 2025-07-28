import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Typography, Tag } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

const DnaResultModal = ({ visible, onClose, resultData }) => {
  if (!resultData) return null;

  // Format createAt
  let createdAtStr = '-';
  if (resultData.createAt) {
    if (Array.isArray(resultData.createAt) && resultData.createAt.length >= 3) {
      const [year, month, day, hour = 0, min = 0] = resultData.createAt;
      createdAtStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    } else if (typeof resultData.createAt === 'string') {
      createdAtStr = dayjs(resultData.createAt).format('DD/MM/YYYY HH:mm');
    }
  }

  return (
    <Modal
      title="DNA Test Result"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={420}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Relationship">
          <Text strong>{resultData.relationship || '-'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Conclusion">
          <Tag color={resultData.conclusion === 'Match' ? 'green' : (resultData.conclusion === 'Not Match' || resultData.conclusion === 'Inconclusive') ? 'red' : 'orange'} style={{ fontWeight: 500 }}>
            {resultData.conclusion || '-'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Confidence %">
          <Text>{resultData.confidencePercentage != null ? resultData.confidencePercentage + '%' : '-'}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          <Text>{createdAtStr}</Text>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default DnaResultModal; 