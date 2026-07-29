import { Router } from 'express';
import { recommendationService } from '../services/RecommendationService';

const router = Router();

const allowedFeedTypes = new Set(['home', 'stories', 'reels', 'friends', 'explore']);

router.get('/', async (req, res) => {
  try {
    const rawUserId = typeof req.query.userId === 'string' ? req.query.userId.trim() : '';
    const rawFeedType = typeof req.query.feedType === 'string' ? req.query.feedType.trim().toLowerCase() : 'home';
    const rawLimit = Number(req.query.limit ?? 20);

    if (!allowedFeedTypes.has(rawFeedType)) {
      res.status(400).json({ error: 'Invalid feedType' });
      return;
    }

    if (!Number.isFinite(rawLimit) || rawLimit < 1 || rawLimit > 50) {
      res.status(400).json({ error: 'limit must be between 1 and 50' });
      return;
    }

    const response = await recommendationService.recommend({
      userId: rawUserId || undefined,
      feedType: rawFeedType as any,
      limit: Math.round(rawLimit),
    });

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: 'Unable to load recommendations' });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { userId, entityType, entityId, action, metadata } = req.body ?? {};

    if (typeof entityType !== 'string' || !entityType.trim()) {
      res.status(400).json({ error: 'entityType is required' });
      return;
    }

    if (typeof entityId !== 'string' || !entityId.trim()) {
      res.status(400).json({ error: 'entityId is required' });
      return;
    }

    if (typeof action !== 'string' || !action.trim()) {
      res.status(400).json({ error: 'action is required' });
      return;
    }

    if (metadata !== undefined && (typeof metadata !== 'object' || Array.isArray(metadata))) {
      res.status(400).json({ error: 'metadata must be an object when provided' });
      return;
    }

    await recommendationService.recordEvent({
      user_id: typeof userId === 'string' && userId.trim() ? userId.trim() : null,
      entity_type: entityType.trim(),
      entity_id: entityId.trim(),
      action: action.trim(),
      metadata,
      created_at: new Date().toISOString(),
    });
    res.status(201).json({ status: 'ok' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record event' });
  }
});

export default router;
