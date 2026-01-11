-- Create Notifications Table
CREATE TYPE notification_type AS ENUM ('LIKE', 'COMMENT', 'SHARE', 'CHALLENGE_EARNED', 'GROUP_INVITE', 'SYSTEM');

CREATE TABLE IF NOT EXISTS public.notifications
(
    notification_id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    type notification_type NOT NULL,
    title character varying(200) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
