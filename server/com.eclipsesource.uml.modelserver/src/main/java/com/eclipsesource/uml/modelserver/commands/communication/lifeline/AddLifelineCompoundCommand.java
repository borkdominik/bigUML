/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.commands.communication.lifeline;

import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.AddShapeCommand;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.impl.GPointImpl;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;

import org.eclipse.glsp.server.emf.model.notation.Shape;

public class AddLifelineCompoundCommand extends CompoundCommand {
   private final EditingDomain domain;
   private final URI modelUri;
   private final Model umlModel;

   public AddLifelineCompoundCommand(final EditingDomain domain, final URI modelUri,
      final String parentSemanticUriFragment, final GPoint lifelinePosition) {
      this.domain = domain;
      this.modelUri = modelUri;
      this.umlModel = UmlSemanticCommandUtil.getModel(modelUri, domain);

      var parentInteraction = UmlSemanticCommandUtil.getElement(umlModel, parentSemanticUriFragment, Interaction.class);
      var command = new AddLifelineCommand(domain, modelUri, parentInteraction);
      var destination = shift(parentInteraction, lifelinePosition);

      this.append(command);
      this.append(new AddShapeCommand(domain, modelUri, destination, () -> command.getNewLifeline()));
   }

   protected GPoint shift(final Interaction interaction, final GPoint mousePosition) {
      String semanticProxyUri = UmlSemanticCommandUtil.getSemanticUriFragment(interaction);
      var interactionShape = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Shape.class);
      var origin = interactionShape.getPosition();
      var size = interactionShape.getSize();

      var destination = new GPointImpl();
      destination.setX(mousePosition.getX() - origin.getX());
      destination.setY(mousePosition.getY() - origin.getY());

      return destination;
   }
}
