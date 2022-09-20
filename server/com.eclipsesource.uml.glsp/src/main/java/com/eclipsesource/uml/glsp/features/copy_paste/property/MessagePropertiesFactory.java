/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.copy_paste.property;

import java.awt.geom.Point2D;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;

import com.eclipsesource.uml.glsp.util.UmlGModelUtil;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.commands.communication.message.MessageCopyableProperties;

public class MessagePropertiesFactory {

   private MessagePropertiesFactory() {

   }

   public static MessageCopyableProperties from(final GEdge element) {
      var semantic = new MessageCopyableProperties.Semantic();
      semantic.id = element.getId();
      UmlGModelUtil.flatFilterById(element, UmlIDUtil.createLabelNameId(element.getId()), GLabel.class).findFirst()
         .ifPresent(label -> semantic.name = label.getText());
      semantic.sourceId = element.getSourceId();
      semantic.targetId = element.getTargetId();

      var notation = new MessageCopyableProperties.Notation();
      element.getRoutingPoints().forEach(point -> {
         notation.bendingPoints.add(new Point2D.Double(point.getX(), point.getY()));
      });

      return new MessageCopyableProperties(semantic, notation);
   }

}
