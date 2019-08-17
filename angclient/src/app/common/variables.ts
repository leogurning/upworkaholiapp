import * as moment from 'moment';

export class GlobalVariables {
    showNavbar = true;
}

export enum JobStatus {
    OPEN = 'OPEN',
    LIST = 'SHORTLISTED',
    ONGO = 'ONGOING',
    CMPL = 'COMPLETED',
    CANC = 'CANCELLED',
}

export enum MilestoneStatusWorker {
    NOTSTARTED = 'NOTSTARTED',
    INPROGRESS = 'INPROGRESS',
    COMPLETED = 'COMPLETED',
}

export enum MilestoneStatusClient {
    OPEN = 'OPEN',
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    CANCELLED = 'CANCELLED',
}

export class GlobalFunctions {
    dateToString(_date: Date): string {
        let result = '';
        result = moment(_date).format('DD/MM/YYYY');
        return result;
    }

    isMember(_array, item): boolean {
        let result = false;
        result = _array.includes(item);
        return result;
    }

    getStatusClass(_status: string): string {
        let result;
        switch (_status) {
            case MilestoneStatusWorker.NOTSTARTED: {
               result = 'btn btn-secondary btn-sm';
               break;
            }
            case MilestoneStatusClient.OPEN: {
                result = 'btn btn-secondary btn-sm';
                break;
            }
            case MilestoneStatusWorker.INPROGRESS: {
                result = 'btn btn-warning btn-sm';
                break;
            }
            case MilestoneStatusClient.PENDING: {
                result = 'btn btn-warning btn-sm';
                break;
            }
            case MilestoneStatusWorker.COMPLETED: {
                result = 'btn btn-success btn-sm';
                break;
            }
            case MilestoneStatusClient.APPROVED: {
                result = 'btn btn-success btn-sm';
                break;
            }
            case MilestoneStatusClient.CANCELLED: {
                result = 'btn btn-danger btn-sm';
                break;
            }
            default: {
                result = 'btn btn-secondary btn-sm';
               break;
            }
        }
        return result;
    }

    getRatingPercentage(rating: number): string {
        let result = 0;
        result = rating * 20;
        return result.toFixed(0);
    }
}


