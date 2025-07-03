import Card from "antd/es/card";
import Search from "antd/es/input/Search";
import Space from "antd/es/space";
import Timeline from "antd/es/timeline";
import Typography from "antd/es/typography";
import dayjs from "dayjs";
import { IssueVO, statusesColorsMap, statusesList } from "iso/src/store/bootstrap/repos/issues";
import { UserVO } from "iso/src/store/bootstrap/repos/users";
import { FORMAT_DAY, GENERAL_DATE_FORMAT } from "iso/src/utils/date-utils";
import { remove, uniq } from "ramda";
import { FC, useState } from "react";
import * as Icons from '@ant-design/icons';
import Button from "antd/es/button";
import { useNotifications } from "../../hooks/useNotifications";
import useCurrentUser from "../../hooks/useCurrentUser";
import { NotificationType, NotificationVO } from "iso/src/store/bootstrap/repos/notifications";
import { ProcessCellForExportParams } from "ag-grid-community/dist/lib/interfaces/exportParams";

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
    item?: IssueVO,
    disabled: boolean,
    notificationOptions?: {
        type?: string,
        title?: string,
    },
    destinations?: string[],
};

const getAuthorName = (user: UserVO) => `${user.name} ${user.lastname}`;
const getCommentLabel = (comment: Comment, isUsersComment: boolean) => {
    if (!comment.author && !comment.date) {
        return '';
    }

    return `${isUsersComment ? 'Я' : comment.author}, ${comment.date ? dayjs(comment.date).format(GENERAL_DATE_FORMAT) : ''}`;
}

export const CommentsLine: FC<CommentsLineProps> = ({value, handleChange, user, item, disabled, notificationOptions, destinations = []}) => {
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useCurrentUser();
    const { createNotifications, discardSingle } = useNotifications(currentUser.userId);
    const notificationDestinations = Array.isArray(value) 
        ? uniq([...destinations, ...value.map(c => c.authorId)]).filter(authorId => authorId && authorId !== currentUser.userId)
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
                    <Space direction="vertical" key={index}>
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
            status: item?.status || statusesList[0],
        }];

        createNotifications(notificationDestinations.map((destination: string): Partial<NotificationVO> => ({
            destination,
            timestamp,
            createdBy: currentUser.userId,
            title: notificationOptions?.title || 'Комментарий',
            message: newComment,
            type: notificationOptions?.type || NotificationType.default,
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
    const comments = props.data ? props.data[props.propKey] : null;

    if (!comments) {
        return null;
    }

    if (Array.isArray(comments)) {
        const commentsCount = comments.length - 1;
        const lastMessage = comments[commentsCount]?.message;

        return comments.length > 1 
            ? `(всего: ${comments.length}) ${lastMessage}`
            : lastMessage;
    }

    return comments;
};

export const getCommentsCell = (propKey: string) => (props) => <CommentsCell {...props} propKey={propKey} />
export const checkIfCommentsCell = (params: ProcessCellForExportParams<any, any>) => {
    return params.value?.[0]?.message;
}
export const getCommentsExcelCell = (comments?: Comment[] | string): string => {
    if (!comments) {
        return '';
    } else {
        if (Array.isArray(comments)) {
            return comments.map((comment: Comment) => {
                return `[${comment.author}. ${dayjs(comment.date).format(FORMAT_DAY)}]: ${comment.message}`
            }).join('; ');
        }

        return comments;
    }
}