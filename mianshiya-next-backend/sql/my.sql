CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `question_id` bigint NOT NULL COMMENT '关联的问题ID',
  `user_id` bigint NOT NULL COMMENT '评论用户ID',
  `content` text NOT NULL COMMENT '评论内容',
  `reply_comment_id` bigint DEFAULT NULL COMMENT '回复的评论ID',
  `reply_user_id` bigint DEFAULT NULL COMMENT '回复的用户ID',
  `reply_user_name` varchar(100) DEFAULT NULL COMMENT '回复的用户名',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_question_id` (`question_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='评论表';

CREATE TABLE `comment_like` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comment_id` bigint NOT NULL COMMENT '评论ID',
  `user_id` bigint NOT NULL COMMENT '点赞用户ID',
  `is_like` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1点赞 0取消',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_comment_user` (`comment_id`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='评论点赞表';

CREATE TABLE `mock_interview` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `workExperience` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '工作年限',
  `jobPosition` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '工作岗位',
  `difficulty` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '面试难度',
  `messages` mediumtext COLLATE utf8mb4_unicode_ci COMMENT '消息列表（JSON 对象数组字段，同时包括了总结）',
  `status` int NOT NULL DEFAULT '0' COMMENT '状态（0-待开始、1-进行中、2-已结束）',
  `userId` bigint NOT NULL COMMENT '创建人（用户 id）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除（逻辑删除）',
  PRIMARY KEY (`id`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='模拟面试';


CREATE TABLE `question` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `content` text COLLATE utf8mb4_unicode_ci COMMENT '内容',
  `tags` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签列表（json 数组）',
  `answer` text COLLATE utf8mb4_unicode_ci COMMENT '推荐答案',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `editTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_title` (`title`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目';


CREATE TABLE `question_bank` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT '描述',
  `picture` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '图片',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `editTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `idx_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题库';

CREATE TABLE `question_bank_question` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionBankId` bigint NOT NULL COMMENT '题库 id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `questionBankId` (`questionBankId`,`questionId`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题库题目';


CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userAccount` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `userPassword` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `unionId` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信开放平台id',
  `mpOpenId` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公众号openId',
  `userName` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `userProfile` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户简介',
  `userRole` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT '用户角色：user/admin/ban',
  `editTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `phoneNumber` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `email` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `grade` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '年级',
  `workExperience` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '工作经验',
  `expertiseDirection` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '擅长方向',
  PRIMARY KEY (`id`),
  KEY `idx_unionId` (`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=1920091471781462019 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户';




CREATE TABLE `choice_question` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '答题记录ID',
  `questionId` bigint NOT NULL COMMENT '题目ID',
  `questionTitle` varchar(1024)  NOT NULL COMMENT '题目标题',
  `choiceOption` json NOT NULL COMMENT '选项（JSON对象，key为a/b/c/d）',
  `answerOption` varchar(10)  NOT NULL COMMENT '答案选择的选项（如a/b/c/d）',
  `answer` varchar(1024)  NOT NULL COMMENT '答案',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '答题时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_questionId` (`questionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='选择题表';



CREATE TABLE `choice_question_log` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '答题记录ID',
  `questionId` bigint NOT NULL COMMENT '题目ID',
	`userId` bigint NOT NULL COMMENT '用户id',
  `selectedOption` varchar(10)  NOT NULL COMMENT '用户选择的选项（如a/b/c/d）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '答题时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_questionId` (`questionId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='选择题表';

#边界：一个新的测评页面，展示 5 个选择题，让用户做，做完后提交，记录用户的答题记录。
# 每个用户提交 一页题目后，展示题目答案与对错，并给出用户的得分。
# 