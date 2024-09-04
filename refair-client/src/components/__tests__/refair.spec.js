import { describe, it, vi, beforeEach, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import refair from '../refair.vue'
import vue from "@vitejs/plugin-vue";

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['v-layout', 'apexchart'].includes(tag)
        }
      }
    })
  ]
};

vi.mock('axios')
vi.mock('downloadjs')

describe('refair.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(refair)
  })

  it('handles file upload correctly', async () => {
    const fileInput = wrapper.find('input[type="file"]')
    const file = new File(['dummy content'], 'stories.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    await fileInput.setValue(file)

    // Simulate file selection
    await wrapper.vm.handleStoriesUpload({ target: { files: [file] } })

    expect(wrapper.vm.file).toBe(file)
  })

  it('calls reportStories and downloads the report', async () => {
    wrapper.vm.stories = ['Story 1', 'Story 2']

    axios.post.mockResolvedValue({ data: JSON.stringify({ key: 'value' }) })

    await wrapper.vm.reportStories()

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/reportStories', expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    expect(downloadjs).toHaveBeenCalledWith(expect.any(String), 'report.json', 'application/json')
  })

  it('calls reportStory and downloads the story report', async () => {
    wrapper.vm.story = 'Story 1'

    axios.post.mockResolvedValue({ data: JSON.stringify({ key: 'value' }) })

    await wrapper.vm.reportStory()

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/reportStory', expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    expect(downloadjs).toHaveBeenCalledWith(expect.any(String), 'report-Story 1.json', 'application/json')
  })

  it('submits the file and updates the stories', async () => {
    const file = new File(['dummy content'], 'stories.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    wrapper.vm.file = file

    axios.post.mockResolvedValue({ data: { stories: ['Story 1', 'Story 2'] } })

    await wrapper.vm.submitFile()

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/storiesload', expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    expect(wrapper.vm.stories).toEqual(['Story 1', 'Story 2'])
  })

  it('toggles the analyze story modal and sets the series data', async () => {
    const story = 'Story 1'

    axios.post.mockResolvedValue({
      data: {
        domain: 'Domain 1',
        tasks_features: { task1: ['feature1'] },
        features_counts: { feature1: 5 }
      }
    })

    await wrapper.vm.toggleAnalyzeStoryModal(story)

    expect(wrapper.vm.story).toBe(story)
    expect(wrapper.vm.activeAnalyzeStoryModal).toBe(true)
    expect(wrapper.vm.story_domain).toBe('Domain 1')
    expect(wrapper.vm.story_tasks).toEqual({ task1: ['feature1'] })
    expect(wrapper.vm.series).toEqual([{
      name: "occurrencies",
      data: [{ x: 'feature1', y: [5] }]
    }])
  })

  it('closes the analyze story modal', async () => {
    wrapper.vm.activeAnalyzeStoryModal = true

    await wrapper.vm.closeAnalyzeStoryModal()

    expect(wrapper.vm.activeAnalyzeStoryModal).toBe(false)
  })
})