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
package com.eclipsesource.uml.modelserver.uml.command.create.edge;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.registry.RepresentationKey;
import com.eclipsesource.uml.modelserver.uml.command.UmlCommandContribution;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.google.gson.JsonSerializer;
import com.google.inject.Inject;

public class CreateEdgeCommandContribution extends UmlCommandContribution {

   public static final String TYPE = "uml:create-edge";

   @Inject
   protected CreateEdgeCommandProviderRegistry registry;

   public static CCommand create(final Representation representation, final Class<? extends EObject> elementType,
      final EObject source, final EObject target) {
      return create(representation, elementType, source, target, null);
   }

   public static CCommand create(final Representation representation, final Class<? extends EObject> elementType,
      final EObject source, final EObject target, final Object argument) {
      return new ContributionEncoder().type(TYPE).representation(representation).elementType(elementType).source(source)
         .target(target)
         .embedJson(argument)
         .ccommand();
   }

   public static <TArgument> CCommand create(final Representation representation,
      final Class<? extends EObject> elementType,
      final EObject source, final EObject target, final TArgument argument,
      final JsonSerializer<TArgument> serializer) {
      return new ContributionEncoder().type(TYPE).representation(representation).elementType(elementType).source(source)
         .target(target)
         .embedJson(argument, serializer)
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(ModelContext.of(modelUri, domain, command, injector));
      var representation = decoder.representation().orElseThrow();
      var elementType = decoder.elementType().orElseThrow();

      return registry.access(RepresentationKey.of(representation, elementType))
         .provideCreateEdgeCommand(decoder.context());
   }
}
