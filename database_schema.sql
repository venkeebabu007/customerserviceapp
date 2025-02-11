-- Add this to your existing schema

-- Table for storing file attachments
CREATE TABLE public.attachments_csapp (
  id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
  ticket_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT attachments_csapp_pkey PRIMARY KEY (id),
  CONSTRAINT attachments_csapp_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES tickets_csapp(id),
  CONSTRAINT attachments_csapp_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES users_csapp(id)
);

-- Add columns to tickets_csapp table
ALTER TABLE public.tickets_csapp
ADD COLUMN assigned_to UUID,
ADD COLUMN escalated BOOLEAN DEFAULT FALSE,
ADD CONSTRAINT tickets_csapp_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES users_csapp(id);

