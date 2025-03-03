import type { AppBskyVideoDefs, AppBskyVideoUploadVideo } from '@tsky/lexicons';
import type { Client } from '~/agent/client';
import type { RPCOptions } from '~/types';

export class Video {
  constructor(private client: Client) {}

  /**
   * Get video upload limits for the authenticated user.
   */
  async limit(options: RPCOptions = {}) {
    const res = await this.client.get(
      'app.bsky.video.getUploadLimits',
      options,
    );

    return res.data;
  }

  /**
   * Get status details for a video processing job.
   */
  async status(jobId: string, options?: RPCOptions) {
    const res = await this.client.get('app.bsky.video.getJobStatus', {
      params: { jobId },
      ...options,
    });

    return new JobStatus(this.client, res.data.jobStatus);
  }

  /**
   * Upload a video to be processed then stored on the PDS.
   */
  async upload(data: AppBskyVideoUploadVideo.Input, options?: RPCOptions) {
    const res = await this.client.call('app.bsky.video.uploadVideo', {
      data,
      ...options,
    });

    return new JobStatus(this.client, res.data.jobStatus);
  }
}

class JobStatus {
  jobId: string;
  did: string;
  /** The state of the video processing job. All values not listed as a known value indicate that the job is in process. */
  state: 'JOB_STATE_COMPLETED' | 'JOB_STATE_FAILED' | (string & {});
  /** Progress within the current processing state. */
  progress?: number;
  blob?: AppBskyVideoDefs.JobStatus['blob'];
  error?: string;
  message?: string;

  constructor(
    private client: Client,
    data: AppBskyVideoDefs.JobStatus,
  ) {
    this.jobId = data.jobId;
    this.did = data.did;

    this.state = data.state;

    this.progress = data.progress;
    this.blob = data.blob;
    this.error = data.error;
    this.message = data.message;
  }

  /**
   * Update status details for a video processing job.
   */
  async refresh(options?: RPCOptions) {
    const res = await this.client
      .get('app.bsky.video.getJobStatus', {
        params: { jobId: this.jobId },
        ...options,
      })
      .then((res) => res.data.jobStatus);

    this.state = res.state;

    this.progress = res.progress;
    this.blob = res.blob;
    this.error = res.error;
    this.message = res.message;
  }
}
