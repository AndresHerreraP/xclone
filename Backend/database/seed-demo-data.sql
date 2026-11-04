USE xclone;
GO

DECLARE @users TABLE (
    full_name NVARCHAR(100),
    username NVARCHAR(50),
    email NVARCHAR(100)
);

INSERT INTO @users VALUES
(N'Laura Gómez', N'laurag', N'laurag@example.com'),
(N'Carlos Ruiz', N'carlosr', N'carlosr@example.com'),
(N'Sofía Martínez', N'sofiam', N'sofiam@example.com'),
(N'Juan Pérez', N'juanp', N'juanp@example.com'),
(N'Valentina Rojas', N'valer', N'valer@example.com'),
(N'Sebastián Ramírez', N'sebastianr', N'sebastianr@example.com'),
(N'Mariana Torres', N'marianat', N'marianat@example.com'),
(N'Diego Vargas', N'diegov', N'diegov@example.com'),
(N'Natalia Castro', N'nataliac', N'nataliac@example.com'),
(N'Andrés Molina', N'andresm', N'andresm@example.com'),
(N'Camila Herrera', N'camilah', N'camilah@example.com'),
(N'Mateo Silva', N'mateos', N'mateos@example.com'),
(N'Paula León', N'paulal', N'paulal@example.com'),
(N'Felipe Cruz', N'felipec', N'felipec@example.com'),
(N'Daniela Ortiz', N'danielao', N'danielao@example.com'),
(N'Nicolás Peña', N'nicolasp', N'nicolasp@example.com'),
(N'Sara Méndez', N'saram', N'saram@example.com'),
(N'Tomás Gil', N'tomasg', N'tomasg@example.com'),
(N'Lucía Pardo', N'luciap', N'luciap@example.com'),
(N'Emilio Nieto', N'emilion', N'emilion@example.com'),
(N'Ana Beltrán', N'anab', N'anab@example.com'),
(N'Gabriel Soto', N'gabriels', N'gabriels@example.com'),
(N'Isabela Mora', N'isabelam', N'isabelam@example.com'),
(N'David Acosta', N'davida', N'davida@example.com'),
(N'Mónica Reyes', N'monicar', N'monicar@example.com');

INSERT INTO dbo.users (full_name, username, email, password_hash, created_at)
SELECT full_name, username, email, N'', SYSDATETIMEOFFSET()
FROM @users AS seed
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.users AS existing
    WHERE existing.username = seed.username
);

DECLARE @userIds TABLE (username NVARCHAR(50), id BIGINT);
INSERT INTO @userIds
SELECT username, id
FROM dbo.users
WHERE username IN (SELECT username FROM @users);

DECLARE @messages TABLE (message NVARCHAR(280));
INSERT INTO @messages VALUES
(N'[Demo ClonX] Probando nuevas ideas para el proyecto.'),
(N'[Demo ClonX] Un pequeño avance también cuenta.'),
(N'[Demo ClonX] Hoy aprendí algo nuevo construyendo esta aplicación.'),
(N'[Demo ClonX] Compartiendo avances con la comunidad.'),
(N'[Demo ClonX] La constancia hace que los proyectos mejoren.');

DECLARE @index INT = 0;
DECLARE @username NVARCHAR(50);
DECLARE @id BIGINT;
DECLARE @message NVARCHAR(280);
DECLARE @post INT;

DECLARE user_cursor CURSOR LOCAL FAST_FORWARD FOR
SELECT username, id FROM @userIds ORDER BY id;
OPEN user_cursor;
FETCH NEXT FROM user_cursor INTO @username, @id;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @index = @index + 1;
    SET @post = 1;
    WHILE @post <= 3
    BEGIN
        SELECT TOP 1 @message = message
        FROM @messages
        ORDER BY ((CHECKSUM(@username) + @index + @post) % 5 + 5) % 5;

        IF NOT EXISTS (
            SELECT 1 FROM dbo.tweets
            WHERE author_id = @id AND content = CONCAT(@message, N' Publicación ', @post)
        )
        BEGIN
            INSERT INTO dbo.tweets (content, author_id, created_at)
            VALUES (CONCAT(@message, N' Publicación ', @post), @id, SYSDATETIMEOFFSET());
        END;
        SET @post = @post + 1;
    END;

    FETCH NEXT FROM user_cursor INTO @username, @id;
END;

CLOSE user_cursor;
DEALLOCATE user_cursor;

DECLARE @follower BIGINT;
DECLARE @followed BIGINT;

DECLARE follow_cursor CURSOR LOCAL FAST_FORWARD FOR
SELECT follower.id, followed.id
FROM @userIds AS follower
JOIN @userIds AS followed ON follower.username <> followed.username
WHERE follower.id < followed.id;
OPEN follow_cursor;
FETCH NEXT FROM follow_cursor INTO @follower, @followed;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM dbo.follows
        WHERE follower_id = @follower AND followed_id = @followed
    )
    BEGIN
        INSERT INTO dbo.follows (follower_id, followed_id, created_at)
        VALUES (@follower, @followed, SYSDATETIMEOFFSET());
    END;

    FETCH NEXT FROM follow_cursor INTO @follower, @followed;
END;

CLOSE follow_cursor;
DEALLOCATE follow_cursor;
GO
