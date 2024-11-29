import type {
  AppBskyNS,
  AppBskyVideoDefs,
  AppBskyVideoGetJobStatus,
  AppBskyVideoGetUploadLimits,
  AppBskyVideoUploadVideo,
  BlobRef,
} from '@atproto/api'

export type VideoJobState =
  | 'JOB_STATE_COMPLETED'
  | 'JOB_STATE_FAILED'
  | (string & {})

export class Video {
  /**
   * Creates a new instance of the Video class.
   * @param instance The instance of the `AppBskyNS` class.
   */
  constructor(private instance: AppBskyNS) {}

  /**
   * Get video upload limits for the authenticated user.
   * @param options Additional options.
   * @returns The video upload limits.
   */
  async limit(options?: AppBskyVideoGetUploadLimits.CallOptions) {
    const res = await this.instance.video.getUploadLimits({}, options)

    return res.data
  }

  /**
   * Get status details for a video processing job.
   * @param jobId The job ID.
   * @param options Additional options.
   * @returns The status details for the video processing job.
   */
  async status(jobId: string, options?: AppBskyVideoGetJobStatus.CallOptions) {
    const res = await this.instance.video.getJobStatus({ jobId }, options)

    return new JobStatus(this.instance, res.data.jobStatus)
  }

  /**
   * Upload a video to be processed then stored on the PDS.
   * @param data The video upload data.
   * @param options Additional options.
   * @returns The status of the video processing job.
   */
  async upload(
    data: AppBskyVideoUploadVideo.InputSchema,
    options?: AppBskyVideoUploadVideo.CallOptions,
  ) {
    const res = await this.instance.video.uploadVideo(data, options)

    return new JobStatus(this.instance, res.data.jobStatus)
  }
}

class JobStatus {
  jobId: string
  did: string
  /** The state of the video processing job. All values not listed as a known value indicate that the job is in process. */
  state: VideoJobState
  /** Progress within the current processing state. */
  progress?: number
  blob?: BlobRef
  error?: string
  message?: string

  constructor(private instance: AppBskyNS, data: AppBskyVideoDefs.JobStatus) {
    this.jobId = data.jobId
    this.did = data.did

    this.state = data.state

    this.progress = data.progress
    this.blob = data.blob
    this.error = data.error
    this.message = data.message
  }

  /**
   * Update status details for a video processing job.
   * @param options Additional options.
   */
  async refresh(options?: AppBskyVideoGetJobStatus.CallOptions) {
    const res = await this.instance.video.getJobStatus(
      { jobId: this.jobId },
      options,
    )

    this.state = res.data.jobStatus.state

    this.progress = res.data.jobStatus.progress
    this.blob = res.data.jobStatus.blob
    this.error = res.data.jobStatus.error
    this.message = res.data.jobStatus.message
  }
}
