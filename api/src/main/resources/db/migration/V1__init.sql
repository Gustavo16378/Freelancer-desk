-- freelancer.desk – schema inicial

CREATE TABLE projects (
    id           VARCHAR(36)    PRIMARY KEY,
    name         VARCHAR(255)   NOT NULL,
    client       VARCHAR(255)   NOT NULL,
    type         VARCHAR(50)    NOT NULL,
    status       VARCHAR(50)    NOT NULL DEFAULT 'aguardando',
    value        NUMERIC(12,2)  NOT NULL DEFAULT 0,
    paid         NUMERIC(12,2)  NOT NULL DEFAULT 0,
    start_date   DATE           NOT NULL,
    deadline     DATE           NOT NULL,
    progress     INTEGER        NOT NULL DEFAULT 0,
    description  TEXT,
    tech         TEXT,
    is_portfolio BOOLEAN        NOT NULL DEFAULT FALSE,
    portfolio_url VARCHAR(512),
    created_at   TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
    id          VARCHAR(36)   PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL,
    date        DATE          NOT NULL,
    time        VARCHAR(10),
    type        VARCHAR(50)   NOT NULL DEFAULT 'outro',
    project_id  VARCHAR(36)   REFERENCES projects(id) ON DELETE SET NULL,
    notes       TEXT,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE payments (
    id          VARCHAR(36)   PRIMARY KEY,
    project_id  VARCHAR(36)   NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description VARCHAR(255)  NOT NULL,
    value       NUMERIC(12,2) NOT NULL DEFAULT 0,
    due_date    DATE          NOT NULL,
    status      VARCHAR(20)   NOT NULL DEFAULT 'pendente',
    paid_at     DATE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE board_cards (
    id          VARCHAR(36)   PRIMARY KEY,
    project_id  VARCHAR(36)   NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    column_name VARCHAR(20)   NOT NULL DEFAULT 'backlog',
    title       VARCHAR(255)  NOT NULL,
    description TEXT,
    priority    VARCHAR(20)   NOT NULL DEFAULT 'media',
    due_date    DATE,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE project_updates (
    id          VARCHAR(36)   PRIMARY KEY,
    project_id  VARCHAR(36)   NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    text        TEXT          NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_date       ON events(date);
CREATE INDEX idx_events_project    ON events(project_id);
CREATE INDEX idx_payments_project  ON payments(project_id);
CREATE INDEX idx_payments_status   ON payments(status);
CREATE INDEX idx_board_project     ON board_cards(project_id);
CREATE INDEX idx_updates_project   ON project_updates(project_id);
