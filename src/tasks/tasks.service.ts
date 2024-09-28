import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    constructor(private schedulerRegistry: SchedulerRegistry) { }
    private counter = 1;

    pluralize(word: string, count: number) {
        return count === 1 ? word + 's' : word;
    }

    @Interval(1000)
    handleInterval() {
        const messageCtx = this.counter === 1 ? 'a message' : `${this.counter} messages`;
        this.logger.warn(`You have recieved ${messageCtx} in case group : IMCASA231 - Dr. Mehta Fever Case`);
        this.counter = this.counter > 5 ? 1 : this.counter + 1
    }

    // @Cron(CronExpression.EVERY_30_SECONDS)
    // handleCron1() {
    //     this.logger.debug('Called every 30 seconds');
    // }

    // @Timeout(5000)
    // handleTimeout() {
    //     this.logger.debug('Called once after 5 seconds');
    // }

    // @Timeout('notifications', 2500)
    // handleTimeout1() { 
    //     this.logger.debug('Manually triggered!');
    // }

    // @Cron(CronExpression.EVERY_5_SECONDS, {
    //     name: 'notifications',
    // })
    // triggerNotifications() {
    //     this.logger.debug('Manually triggered!');
    // }

    addCronJob(name: string, seconds: string) {
        const job = new CronJob(`${seconds} * * * * *`, () => {
            this.logger.warn(`time (${seconds}) for job ${name} to run!`);
        });

        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        this.logger.warn(
            `job ${name} added for each minute at ${seconds} seconds!`,
        );
    }


    deleteCron(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
        this.logger.warn(`job ${name} deleted!`);
    }

    getCrons() {
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((value, key, map) => {
            let next;
            try {
                next = value.nextDate().toJSDate();
            } catch (e) {
                next = 'error: next fire date is in the past!';
            }
            this.logger.log(`job: ${key} -> next: ${next}`);
        });
    }

    addInterval(name: string, milliseconds: number) {
        const callback = () => {
            this.logger.warn(`Interval ${name} executing at time (${milliseconds})!`);
        };

        const interval = setInterval(callback, milliseconds);
        this.schedulerRegistry.addInterval(name, interval);
    }


    deleteInterval(name: string) {
        this.schedulerRegistry.deleteInterval(name);
        this.logger.warn(`Interval ${name} deleted!`);
    }

    getIntervals() {
        const intervals = this.schedulerRegistry.getIntervals();
        intervals.forEach(key => this.logger.log(`Interval: ${key}`));
    }

    addTimeout(name: string, milliseconds: number) {
        const callback = () => {
            this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
        };

        const timeout = setTimeout(callback, milliseconds);
        this.schedulerRegistry.addTimeout(name, timeout);
    }

    deleteTimeout(name: string) {
        this.schedulerRegistry.deleteTimeout(name);
        this.logger.warn(`Timeout ${name} deleted!`);
    }


    getTimeouts() {
        const timeouts = this.schedulerRegistry.getTimeouts();
        timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
    }


}
