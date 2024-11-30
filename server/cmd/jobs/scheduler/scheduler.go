package scheduler

// InitScheduler initializes the scheduler which will go over all the modules and create the scheduled jobs making sure to upsert them on the database
// Then it will start the scheduler as a go routine that runs every 30 seconds and checks if there are any new jobs to be scheduled and execute their handlers as tasks
func NewScheduler() {

}
