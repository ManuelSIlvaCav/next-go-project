package scheduler

type Scheduler struct {
}

// InitScheduler initializes the scheduler which will go over all the modules and create the scheduled jobs making sure to upsert them on the database
// Then it will start the scheduler as a go routine that runs every 30 seconds and checks if there are any new jobs to be scheduled and execute their handlers as tasks
func NewScheduler() {

}

func (s *Scheduler) StartScheduler() {
	// Go through all the registered jobs
	// If the job is not in the database, insert it
	// If the job is in the database, update it
	// Check all the jobs and see if any of them was removed
	s.UpdateJobs()

	//Start a go routine that runs every 30 seconds and checks if there are any new jobs to be scheduled and execute their handlers as tasks

	go s.Run()
}

func (s *Scheduler) UpdateJobs() {

}

// Main function that runs on a goroutine
func (s *Scheduler) Run() {

}
