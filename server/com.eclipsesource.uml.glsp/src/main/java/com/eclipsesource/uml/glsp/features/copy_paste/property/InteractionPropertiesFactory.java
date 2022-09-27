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
import org.eclipse.glsp.graph.GNode;

import com.eclipsesource.uml.glsp.uml.communication_diagram.constants.CommunicationConfig;
import com.eclipsesource.uml.glsp.util.UmlGModelUtil;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.InteractionCopyableProperties;

public class InteractionPropertiesFactory {

   private InteractionPropertiesFactory() {

   }

   public static InteractionCopyableProperties from(final GNode element) {
      var semantic = new InteractionCopyableProperties.Semantic();
      semantic.id = element.getId();
      UmlGModelUtil.flatFilterById(element, UmlIDUtil.createHeaderLabelId(element.getId()), GLabel.class).findFirst()
         .ifPresent(label -> semantic.name = label.getText());
      UmlGModelUtil.flatFilterByType(element, CommunicationConfig.Types.LIFELINE, GNode.class).forEach(lifeline -> {
         semantic.lifelines.add(LifelinePropertiesFactory.from(lifeline));
      });
      UmlGModelUtil.flatFilterByType(element, CommunicationConfig.Types.MESSAGE, GEdge.class).forEach(message -> {
         semantic.messages.add(MessagePropertiesFactory.from(message));
      });

      var notation = new InteractionCopyableProperties.Notation();
      notation.position = new Point2D.Double(element.getPosition().getX(), element.getPosition().getY());

      return new InteractionCopyableProperties(semantic, notation);
   }

}
