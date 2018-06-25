CREATE FUNCTION notify_trigger() 
    RETURNS trigger AS $$ 
    DECLARE 
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            PERFORM pg_notify('watchers', jsonb_build_object('table_name' , TG_TABLE_NAME::text , 'data' , row_to_json(OLD)::text , 'operation' , TG_OP::text )::text);  
        ELSE
            PERFORM pg_notify('watchers', jsonb_build_object('table_name' , TG_TABLE_NAME::text , 'data' , row_to_json(NEW)::text , 'operation' , TG_OP::text )::text);  
        END IF;
        RETURN new; 
    END; 
    $$ LANGUAGE plpgsql;

CREATE TABLE messages (id serial NOT NULL primary key, content text, sender varchar(100), receiver varchar(100), createdAt timestamp default NULL);

CREATE TRIGGER watched_table_trigger AFTER INSERT OR UPDATE OR DELETE ON messages FOR EACH ROW EXECUTE PROCEDURE notify_trigger();