IF DB_ID(N'xclone') IS NULL
BEGIN
    CREATE DATABASE xclone;
END;
GO

USE xclone;
GO

IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        full_name NVARCHAR(100) NOT NULL,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        password_hash NVARCHAR(100) NOT NULL DEFAULT N'',
        created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
    );
END;
GO

IF OBJECT_ID(N'dbo.tweets', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.tweets (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        content NVARCHAR(280) NOT NULL,
        author_id BIGINT NOT NULL,
        created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        CONSTRAINT FK_tweets_users FOREIGN KEY (author_id) REFERENCES dbo.users(id)
    );
END;
GO

IF OBJECT_ID(N'dbo.follows', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.follows (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        follower_id BIGINT NOT NULL,
        followed_id BIGINT NOT NULL,
        created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
        CONSTRAINT UQ_follows_pair UNIQUE (follower_id, followed_id),
        CONSTRAINT CK_follows_not_self CHECK (follower_id <> followed_id),
        CONSTRAINT FK_follows_follower FOREIGN KEY (follower_id) REFERENCES dbo.users(id),
        CONSTRAINT FK_follows_followed FOREIGN KEY (followed_id) REFERENCES dbo.users(id)
    );
END;
GO
