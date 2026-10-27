-- Performance indexes and extra integrity constraints.
-- Idempotent guards make it safe on any database state.
-- Expected data volume for the pagination queries makes these indexes worthwhile.

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_tweets_author_created_at' AND object_id = OBJECT_ID('tweets'))
    CREATE INDEX ix_tweets_author_created_at ON tweets (author_id, created_at DESC);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_follows_followed' AND object_id = OBJECT_ID('follows'))
    CREATE INDEX ix_follows_followed ON follows (followed_id);

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'ck_follows_no_self_follow')
    ALTER TABLE follows ADD CONSTRAINT ck_follows_no_self_follow CHECK (follower_id <> followed_id);
