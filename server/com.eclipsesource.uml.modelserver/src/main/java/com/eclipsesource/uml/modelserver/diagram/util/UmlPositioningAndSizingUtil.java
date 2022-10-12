package com.eclipsesource.uml.modelserver.diagram.util;

import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.util.GraphUtil;

public class UmlPositioningAndSizingUtil {
    private UmlPositioningAndSizingUtil() {}

    public static int HEADER_HEIGHT = 38;

    public static GPoint getRelativePosition(final GPoint parentPosition, final GPoint clickLocation) {
        return getRelativePosition(parentPosition, clickLocation, true);
    }

    public static GPoint getRelativePosition(final GPoint parentPosition, final GPoint clickLocation,
                                             final boolean parentHasHeader) {
        if (parentHasHeader) {
            return GraphUtil.point(clickLocation.getX() - parentPosition.getX(),
                    clickLocation.getY() - parentPosition.getY() - HEADER_HEIGHT);
        }
        return GraphUtil.point(clickLocation.getX() - parentPosition.getX(),
                clickLocation.getY() - parentPosition.getY());
    }
}
