# Manual Test Report: Add Portfolio Project

## Scope

- Site: https://www.offer-hub.org
- Issue: #1356
- Flow: Add a new portfolio project with a title, description, and image.
- Branch: manual-test-portfolio-project-flow
- Tester: OlaBakare
- Test date: May 31, 2026

## Execution Status

Passed for the add-portfolio project flow.

The add-portfolio flow was manually tested on https://www.offer-hub.org using an authenticated contributor account. Screenshots are included in `reports/issue-1356/screenshots/`.

## Required Production Data

- Real profile completed with owned email, real/professional name, recognizable username, profile photo, bio, location, title, and timezone.
- Real service published with professional title, detailed description, real representative image, price, and delivery time.
- Real offer published with professional title, detailed description, budget, and timeline.

## Test Steps

| Step | Expected Result | Status | Screenshot |
| --- | --- | --- | --- |
| Open https://www.offer-hub.org and sign in with a real account. | User is authenticated and can access portfolio management. | Passed | `screenshots/add-project-form-filled.png` |
| Open the portfolio page. | Portfolio page loads and portfolio management is available. | Passed | `screenshots/add-project-form-filled.png` |
| Start adding a new portfolio project. | Add project form is visible. | Passed | `screenshots/add-project-form-filled.png` |
| Enter a real professional project title and description. | Text fields accept and retain the entered data. | Passed | `screenshots/add-project-form-filled.png` |
| Upload one real project image. | Image uploads successfully and a preview is visible. | Passed | `screenshots/add-project-image-preview.png` |
| Save the project. | Project is saved without errors. | Passed | `screenshots/saved-project-visible.png` |
| Return to the portfolio list/page. | Newly added project appears in the portfolio. | Passed | `screenshots/saved-project-visible.png` |

## Result

Passed. The project was created successfully and appeared in the portfolio list.

## Required Evidence

- Completed real profile screenshot: Not included in this report
- Published real service page screenshot: Not included in this report
- Published real offer page screenshot: Not included in this report
- Portfolio page with existing projects: `screenshots/saved-project-visible.png`
- Add project form populated with real content: `screenshots/add-project-form-filled.png`
- Uploaded project image preview: `screenshots/add-project-image-preview.png`
- Saved project visible in portfolio: `screenshots/saved-project-visible.png`

## Notes

The test project used the title `Offer Hub Portfolio Flow QA Test`, category `Web Development`, four tags, project and repository URLs, same-day start/end dates, and one uploaded image.
