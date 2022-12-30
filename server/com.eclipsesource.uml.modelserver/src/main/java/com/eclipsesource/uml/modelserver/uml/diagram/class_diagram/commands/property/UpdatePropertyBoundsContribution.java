/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.property;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Property;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.util.ClassSemanticCommandUtil;

public final class UpdatePropertyBoundsContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:set_property_bounds";
   private static final String NEW_BOUNDS = "new_bounds";

   public static CCommand create(final Property semanticElement, final String newBounds) {
      return new ContributionEncoder().type(TYPE).element(semanticElement).extra(NEW_BOUNDS, newBounds).ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var element = decoder.element(Property.class);
      var newBounds = decoder.extra(NEW_BOUNDS);
      var newLowerBound = ClassSemanticCommandUtil.getLower(newBounds);
      var newUpperBound = ClassSemanticCommandUtil.getUpper(newBounds);

      return element
         .<Command> map(e -> new UpdatePropertyBoundsSemanticCommand(context, e, newLowerBound, newUpperBound))
         .orElse(new NoopCommand());
   }

}
