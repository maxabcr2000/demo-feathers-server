CREATE TABLE messages (
    id serial NOT NULL primary key, 
    content text, 
    sender varchar(100), 
    receiver varchar(100), 
    createdAt timestamp default NULL
);

CREATE FUNCTION notify_trigger() 
    RETURNS trigger AS $$ 
    DECLARE 
    BEGIN
        -- PERFORM pg_notify('watchers', jsonb_build_object('table_name' , TG_TABLE_NAME::text , 'data' , row_to_json(OLD)::text , 'operation' , TG_OP::text )::text);  
        PERFORM pg_notify(lower(TG_OP), row_to_json(NEW)::text); 
        RETURN new; 
    END; 
    $$ LANGUAGE plpgsql;

CREATE FUNCTION notify_trigger_delete() 
    RETURNS trigger AS $$ 
    DECLARE 
    BEGIN
        -- PERFORM pg_notify('watchers', jsonb_build_object('table_name' , TG_TABLE_NAME::text , 'data' , row_to_json(OLD)::text , 'operation' , TG_OP::text )::text);  
        PERFORM pg_notify(lower(TG_OP), row_to_json(OLD)::text); 
        RETURN new; 
    END; 
    $$ LANGUAGE plpgsql;

CREATE TRIGGER watched_insert_trigger AFTER INSERT ON messages FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
CREATE TRIGGER watched_update_trigger AFTER UPDATE ON messages FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
CREATE TRIGGER watched_delete_trigger AFTER DELETE ON messages FOR EACH ROW EXECUTE PROCEDURE notify_trigger_delete();