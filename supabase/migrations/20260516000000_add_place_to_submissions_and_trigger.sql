-- Add place_id to submissions
ALTER TABLE submissions ADD COLUMN place_id UUID REFERENCES places(id);

-- Trigger function to auto-approve 'verified' creators and create a pin
CREATE OR REPLACE FUNCTION process_submission_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the creator is 'verified'
  IF EXISTS (
    SELECT 1 FROM creators
    WHERE id = NEW.creator_id AND tier = 'verified'
  ) THEN
    -- Auto-approve the submission
    NEW.status := 'approved';
    
    -- Insert into pins table automatically
    INSERT INTO pins (creator_id, place_id, note, source_post_url, status)
    VALUES (NEW.creator_id, NEW.place_id, 'Suggested via tag', NEW.post_url, 'approved');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function before inserting a submission
CREATE TRIGGER trg_process_submission
BEFORE INSERT ON submissions
FOR EACH ROW
EXECUTE FUNCTION process_submission_status();
