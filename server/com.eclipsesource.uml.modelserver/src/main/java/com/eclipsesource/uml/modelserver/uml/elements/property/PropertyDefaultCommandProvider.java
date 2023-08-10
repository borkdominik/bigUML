/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.elements.property;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.AttributeOwner;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddShapeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.BasicElementCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.property.commands.CreatePropertySemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.property.commands.UpdatePropertyArgument;
import com.eclipsesource.uml.modelserver.uml.elements.property.commands.UpdatePropertySemanticCommand;

public class PropertyDefaultCommandProvider extends BasicElementCommandProvider<Property> {

   @Override
   public Command provideCreateCommand(final ModelContext context) {
      var decoder = new ContributionDecoder(context);

      var parent = decoder.parent(AttributeOwner.class).orElseThrow();
      var position = decoder.position().orElseThrow();

      var semantic = new CreatePropertySemanticCommand(context, parent);
      var notation = new AddShapeNotationCommand(
         context, semantic::getSemanticElement, position, GraphUtil.dimension(160, 50));

      var command = new CompoundCommand();
      command.append(semantic);
      command.append(notation);
      return command;
   }

   @Override
   public Command provideUpdateCommand(final ModelContext context, final Property element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdatePropertyArgument.class);

      var command = new CompoundCommand();
      command.append(new UpdatePropertySemanticCommand(context, element, update));
      return command;
   }

}
