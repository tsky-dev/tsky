import type {
  AppBskyNS,
  AppBskyVideoGetJobStatus,
  AppBskyVideoGetUploadLimits,
  AppBskyVideoUploadVideo,
  AppBskyVideoDefs,
  BlobRef,
} from "@atproto/api";

export class Video {
  constructor(private instance: AppBskyNS) {}

  /**
   * Get video upload limits for the authenticated user.
   */
  async limit(options?: AppBskyVideoGetUploadLimits.CallOptions) {
    const res = await this.instance.video.getUploadLimits({}, options);

    return res.data;
  }

  /**
   * Get status details for a video processing job.
   */
  async status(jobId: string, options?: AppBskyVideoGetJobStatus.CallOptions) {
    const res = await this.instance.video.getJobStatus({ jobId }, options);

    return new JobStatus(this.instance, res.data.jobStatus);
  }

  /**
   * Upload a video to be processed then stored on the PDS.
   */
  async upload(
    data: AppBskyVideoUploadVideo.InputSchema,
    options?: AppBskyVideoUploadVideo.CallOptions
  ) {
    const res = await this.instance.video.uploadVideo(data, options);

    return new JobStatus(this.instance, res.data.jobStatus);
  }
}

class JobStatus {
  jobId: string;
  did: string;
  /** The state of the video processing job. All values not listed as a known value indicate that the job is in process. */
  state: "JOB_STATE_COMPLETED" | "JOB_STATE_FAILED" | (string & {});
  /** Progress within the current processing state. */
  progress?: number;
  blob?: BlobRef;
  error?: string;
  message?: string;

  constructor(private instance: AppBskyNS, data: AppBskyVideoDefs.JobStatus) {
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
  async refresh(options?: AppBskyVideoGetJobStatus.CallOptions) {
    const res = await this.instance.video.getJobStatus(
      { jobId: this.jobId },
      options
    );

    this.state = res.data.jobStatus.state;

    this.progress = res.data.jobStatus.progress;
    this.blob = res.data.jobStatus.blob;
    this.error = res.data.jobStatus.error;
    this.message = res.data.jobStatus.message;
  }
}
