import Card from "antd/es/card";
import Search from "antd/es/input/Search";
import Space from "antd/es/space";
import Timeline from "antd/es/timeline";
import Typography from "antd/es/typography";
import dayjs from "dayjs";
import { IssueVO, statusesColorsMap } from "iso/src/store/bootstrap/repos/issues";
import { UserVO } from "iso/src/store/bootstrap/repos/users";
import { GENERAL_DATE_FORMAT } from "iso/src/utils/date-utils";
import { remove } from "ramda";
import { FC, useState } from "react";
import * as Icons from '@ant-design/icons';
import Button from "antd/es/button";

type Comment = {
    author?: string,
    date?: string,
    message: string,
    status?: string,
};

interface CommentsLineProps {
    value: Comment[] | string,
    handleChange: (comments: Comment[]) => void,
    user: UserVO,
    item: IssueVO,
    disabled: boolean,
};

const getAuthorName = (user: UserVO) => `${user.name} ${user.lastname}`;
const getCommentLabel = (comment: Comment, isUsersComment: boolean) => {
    if (!comment.author && !comment.date) {
        return '';
    }

    return `${isUsersComment ? 'Я' : comment.author}, ${comment.date ? dayjs(comment.date, GENERAL_DATE_FORMAT) : ''}`;
}

export const CommentsLine: FC<CommentsLineProps> = ({value, handleChange, user, item, disabled}) => {
    const [newComment, setNewComment] = useState('');

    const handleRemoveComment = (index: number) => {
        const result = remove(index, 1, value);

        handleChange(result);
    }

    let items = [];
    
    if (Array.isArray(value)) {
        items = value.map((c, index) => {
            const isUsersComent = c.author === getAuthorName(user);
            const commentLabel = getCommentLabel(c, isUsersComent);

            return {
                children: (
                    <Space direction="vertical">
                        {
                            commentLabel && (
                                <Space>
                                    <Typography.Text type='secondary' strong={isUsersComent}>
                                        {commentLabel}
                                    </Typography.Text>
                                    {isUsersComent && (
                                        <Button 
                                            danger
                                            ghost
                                            icon={<Icons.DeleteOutlined />} 
                                            onClick={() => handleRemoveComment(index)} 
                                        />
                                    )}
                                </Space>
                            )
                        }
                        <Typography.Text>
                            {c.message}
                        </Typography.Text>
                    </Space>
                ),
                color: statusesColorsMap[c.status] || 'blue',
            };
        });
    } else {
        items = value ? [{ children: value }] : [];
    }

    const handleAddComment = () => {
        const prevValue: Comment[] = value 
            ? Array.isArray(value) 
                ? value 
                : [{ message: value }] 
            : [];

        const result: Comment[] = [...prevValue, {
            author: getAuthorName(user),
            date: dayjs().format(GENERAL_DATE_FORMAT),
            message: newComment,
            status: item.status,
        }];

        handleChange(result);
        setNewComment('');
    }

    return (
        <div>
            {value && value.length && (
                <Card style={{ maxHeight: 150, overflow: 'scroll' }}>
                    <Timeline items={items} />
                </Card>
            )}
            {!disabled && (
                <Search
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onSearch={handleAddComment}
                    enterButton="Отправить" 
                />
            )}
        </div>
    );
};

export const CommentsCell = (props) => {
    const { contactInfo } = props.data || {};

    if (!contactInfo) {
        return null;
    }

    if (Array.isArray(contactInfo)) {
        const lastMessage = contactInfo[contactInfo.length - 1]?.message;

        return contactInfo.length > 1 
            ? `(всего: ${contactInfo.length}) ${contactInfo[contactInfo.length - 1]?.message}`
            : lastMessage;
    }

    return contactInfo
}