package scheduler

type SchedulerJob struct {
	ID         string `json:"id" db:"id"`
	Key        string `json:"key" db:"key"`
	Expression string `json:"expression" db:"expression"`
	Type       string `json:"type" db:"type"` //Recurrent or one-time

}
