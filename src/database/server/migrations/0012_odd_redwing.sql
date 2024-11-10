CREATE INDEX IF NOT EXISTS "idx_file_chunks_chunk_id" ON "file_chunks" USING btree ("chunk_id");
