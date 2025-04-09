import Card from "antd/es/card";
import Search from "antd/es/input/Search";
import Space from "antd/es/space";
import Timeline from "antd/es/timeline";
import Typography from "antd/es/typography";
import dayjs from "dayjs";
import { IssueVO, statusesColorsMap } from "iso/src/store/bootstrap/repos/issues";
import { UserVO } from "iso/src/store/bootstrap/repos/users";
import { GENERAL_DATE_FORMAT } from "iso/src/utils/date-utils";
import { remove, uniq } from "ramda";
import { FC, useState } from "react";
import * as Icons from '@ant-design/icons';
import Button from "antd/es/button";
import { useNotifications } from "../../hooks/useNotifications";
import useCurrentUser from "../../hooks/useCurrentUser";
import { NotificationType, NotificationVO } from "iso/src/store/bootstrap/repos/notifications";

type Comment = {
    author?: string,
    authorId?: string,
    date?: Date,
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

    return `${isUsersComment ? 'Я' : comment.author}, ${comment.date ? dayjs(comment.date).format(GENERAL_DATE_FORMAT) : ''}`;
}

export const CommentsLine: FC<CommentsLineProps> = ({value, handleChange, user, item, disabled}) => {
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useCurrentUser();
    const { createNotifications, discardSingle } = useNotifications(currentUser.userId);
    const notificationDestinations = Array.isArray(value) 
        ? uniq(value.map(c => c.authorId)).filter(authorId => authorId !== currentUser.userId)
        : [];

    const handleRemoveComment = (index: number) => {
        const removingComment = Array.isArray(value) ? { ...value[index] } : null;
        const result = remove(index, 1, value);

        discardSingle({ timestamp: removingComment.date });
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
        const timestamp = new Date();
        const prevValue: Comment[] = value 
            ? Array.isArray(value) 
                ? value 
                : [{ message: value }] 
            : [];

        const result: Comment[] = [...prevValue, {
            author: getAuthorName(user),
            authorId: user.userId,
            date: timestamp,
            message: newComment,
            status: item.status,
        }];

        createNotifications(notificationDestinations.map((destination: string): Partial<NotificationVO> => ({
            destination,
            timestamp,
            createdBy: currentUser.userId,
            title: 'Комментарий',
            message: newComment,
            type: NotificationType.default,
            createdLink: location.pathname + location.hash,
        })));

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