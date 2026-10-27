-- Initial schema for the X clone.
-- Applied by Flyway only on an empty database. Databases that already have tables
-- (e.g. previously created by Hibernate) are baselined at version 1 and skip this script.
-- The DDL matches the entities in com.xclone.backend.entity and the SQL Server schema in use.

CREATE TABLE users (
    id            bigint         IDENTITY(1,1) NOT NULL,
    full_name     nvarchar(100)  NOT NULL,
    username      varchar(50)    NOT NULL,
    email         varchar(100)   NOT NULL,
    password_hash varchar(100)   NOT NULL,
    created_at    datetimeoffset NOT NULL,
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX uk_users_username ON users (username);
CREATE UNIQUE INDEX uk_users_email ON users (email);

CREATE TABLE tweets (
    id         bigint         IDENTITY(1,1) NOT NULL,
    author_id  bigint         NOT NULL,
    content    nvarchar(280)  NOT NULL,
    created_at datetimeoffset NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_tweets_author FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE TABLE follows (
    id          bigint         IDENTITY(1,1) NOT NULL,
    follower_id bigint         NOT NULL,
    followed_id bigint         NOT NULL,
    created_at  datetimeoffset NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES users (id),
    CONSTRAINT fk_follows_followed FOREIGN KEY (followed_id) REFERENCES users (id),
    CONSTRAINT uk_follows_pair UNIQUE (follower_id, followed_id)
);
