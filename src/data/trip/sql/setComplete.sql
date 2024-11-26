UPDATE trips 
SET status = 'Completed',
    timeCompleted = ?
WHERE id = ?;
