-- Run once in SQL Server (SSMS, sqlcmd, DBeaver...).
-- Tables are created by Flyway automatically when the backend starts
-- (migrations in src/main/resources/db/migration).
IF DB_ID('xclone') IS NULL
    CREATE DATABASE xclone;
GO
