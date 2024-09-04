import { describe, it, vi, beforeEach,expect } from 'vitest'
import { mount } from '@vue/test-utils'
import refair from '../refair.vue'
import axios from "axios";


vi.mock('axios')
const mockDownloadjs = vi.fn();
global.dowloadjs = mockDownloadjs;

describe('refair.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(refair, {
      data() {
        return {
          file: null,
          stories: [],
          story: '',
          story_domain: '',
          story_tasks: [],
          activeAnalyzeStoryModal: false,
          series: [{ name: 'series-1', data: [] }],
        };
      },
    });
  });

  it('reportStory', async () => {
    axios.post.mockResolvedValue({
      data: "{'story': 'report'}",
    });

    await wrapper.vm.reportStory();

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/reportStory'),
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    expect(mockDownloadjs).toHaveBeenCalledWith(
      '{"story":"report"}',
      'report-example-story.json',
      'application/json'
    );
  });
})