# Anonymous Generation Test Scenarios

## Test 1: Anonymous User First Visit
1. Open browser in incognito mode
2. Navigate to http://localhost:3002
3. Fill in property details
4. **Expected**: Generate button shows "Generate your preview"
5. Click generate
6. **Expected**: Content generates successfully without requiring sign-in
7. **Expected**: Content is blurred with "Sign in to reveal" button
8. **Expected**: During generation, see "Creating Your Preview" header

## Test 2: Anonymous User Second Generation Attempt
1. After first generation (Test 1), try to generate again
2. **Expected**: Generate button shows "Sign in to continue"
3. Click generate
4. **Expected**: Auth modal appears prompting sign-in
5. **Expected**: Toast message shows "Sign in to generate more content"

## Test 3: Logged-In User Experience
1. Sign in with valid credentials
2. Navigate to form
3. **Expected**: Generate button shows "Generate from these details"
4. Click generate
5. **Expected**: Content generates with "Creating Your Premium Content" header
6. **Expected**: Content is immediately visible (no blur)
7. **Expected**: No reveal button appears
8. Can generate multiple times without restrictions

## Test 4: Session Storage Persistence
1. As anonymous user, generate once
2. Refresh the page
3. Try to generate again
4. **Expected**: Still limited (session storage persists)
5. Clear session storage (F12 > Application > Session Storage > Clear)
6. Try to generate
7. **Expected**: Can generate once more as "new" anonymous user

## Test 5: Value Messaging During Generation
1. As anonymous user, start generation
2. Click expand button (+) on progress indicator
3. **Expected**: See message "🎯 Sign in after preview to save and customize unlimited content!" after stage 3
4. As logged-in user, start generation
5. **Expected**: See regular fun facts instead of sign-in prompt

## Test 6: Sample Listing Behavior
1. As anonymous user, click "Use a sample listing instead"
2. **Expected**: Sample content loads but is blurred
3. **Expected**: "Sign in to view full content" message appears
4. Sign in
5. **Expected**: Sample content becomes immediately visible

## Key Areas to Verify:
- ✅ Anonymous users can generate exactly ONE preview
- ✅ Generate button text changes based on state
- ✅ Logged-in users have no restrictions
- ✅ Auto-reveal works for logged-in users
- ✅ Value messaging appears during generation for anonymous users
- ✅ Session storage correctly tracks anonymous generations
- ✅ Auth modal triggers at the right times