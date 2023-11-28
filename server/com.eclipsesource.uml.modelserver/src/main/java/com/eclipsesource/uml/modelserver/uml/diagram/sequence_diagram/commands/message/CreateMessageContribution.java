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
package com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.commands.message;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.impl.GPointImpl;
import org.eclipse.uml2.uml.Interaction;
import org.eclipse.uml2.uml.Lifeline;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageKind;
import com.eclipsesource.uml.modelserver.uml.diagram.sequence_diagram.constants.UmlMessageSort;

public class CreateMessageContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "sequence:add_message";
   private static final String SORT_KEYWORD = "sort_keyword";
   private static final String KIND_KEYWORD = "kind_keyword";

   public static CCommand create(final Lifeline source, final Lifeline target) {
      return new ContributionEncoder().type(TYPE).source(source).target(target).ccommand();
   }

   public static CCommand create(final Lifeline source, final Lifeline target, final GPoint sourceLocation,
      final GPoint targetLocation, final UmlMessageSort type) {
      return new ContributionEncoder().type(TYPE).source(source).target(target)
         .embedJson("sourceLocation", sourceLocation).embedJson("targetLocation", targetLocation)
         .extra(SORT_KEYWORD, type.name())
         .extra(KIND_KEYWORD, UmlMessageKind.COMPLETE.name())
         .ccommand();
   }

   // Found message
   public static CCommand create(final Interaction source, final Lifeline target, final GPoint sourceLocation,
      final GPoint targetLocation, final UmlMessageSort type, final UmlMessageKind kind) {
      return new ContributionEncoder().type(TYPE).source(source).target(target)
         .embedJson("sourceLocation", sourceLocation).embedJson("targetLocation", targetLocation)
         .extra(SORT_KEYWORD, type.name())
         .extra(KIND_KEYWORD, kind.name())
         .ccommand();
   }

   // Lost message
   public static CCommand create(final Lifeline source, final Interaction target, final GPoint sourceLocation,
      final GPoint targetLocation, final UmlMessageSort type, final UmlMessageKind kind) {
      return new ContributionEncoder().type(TYPE).source(source).target(target)
         .embedJson("sourceLocation", sourceLocation).embedJson("targetLocation", targetLocation)
         .extra(SORT_KEYWORD, type.name())
         .extra(KIND_KEYWORD, kind.name())
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {

      var decoder = new ContributionDecoder(modelUri, domain, command);
      var context = decoder.context();
      var sourcePosition = decoder.embedJson("sourceLocation", GPointImpl.class);
      var targetPosition = decoder.embedJson("targetLocation", GPointImpl.class);
      var sort = UmlMessageSort.valueOf(decoder.extra(SORT_KEYWORD));
      var kind = UmlMessageKind.valueOf(decoder.extra(KIND_KEYWORD));

      switch (kind) {
         case FOUND:
            var source_found = decoder.source(Interaction.class);
            var target_found = decoder.target(Lifeline.class);
            if (source_found.isPresent() && target_found.isPresent()) {
               return new CreateMessageCompoundCommand(context, source_found.get(), target_found.get(), sourcePosition,
                  targetPosition,
                  sort, kind);
            }
            break;
         case LOST:
            var source_lost = decoder.source(Lifeline.class);
            var target_lost = decoder.target(Interaction.class);
            if (source_lost.isPresent() && target_lost.isPresent()) {
               return new CreateMessageCompoundCommand(context, source_lost.get(), target_lost.get(), sourcePosition,
                  targetPosition,
                  sort, kind);
            }
            break;
         default:
            var source = decoder.source(Lifeline.class);
            var target = decoder.target(Lifeline.class);
            if (source.isPresent() && target.isPresent()) {
               return new CreateMessageCompoundCommand(context, source.get(), target.get(), sourcePosition,
                  targetPosition,
                  sort, kind);
            }
            break;
      }
      return new NoopCommand();

   }

}
