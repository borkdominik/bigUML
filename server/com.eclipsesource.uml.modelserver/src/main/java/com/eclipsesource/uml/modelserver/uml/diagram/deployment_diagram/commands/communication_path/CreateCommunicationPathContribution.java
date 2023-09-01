package com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.commands.communication_path;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Node;

import com.eclipsesource.uml.modelserver.core.commands.noop.NoopCommand;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.codec.ContributionEncoder;
import com.eclipsesource.uml.modelserver.uml.diagram.deployment_diagram.constants.AssociationType;

public final class CreateCommunicationPathContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "deployment:add_communication_path";
   private static final String TYPE_KEYWORD = "type_keyword";

   public static CCommand create(final Node source, final Node target, final AssociationType keyword) {
      return new ContributionEncoder().type(TYPE).source(source).target(target).extra(TYPE_KEYWORD, keyword.name())
         .ccommand();
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var decoder = new ContributionDecoder(modelUri, domain, command);

      var context = decoder.context();
      var source = decoder.source(Node.class);
      var target = decoder.target(Node.class);
      var type = AssociationType.valueOf(decoder.extra(TYPE_KEYWORD));

      if (source.isPresent() && target.isPresent()) {
         return new CreateCommunicationPathCompoundCommand(context, source.get(), target.get(), type);
      }

      return new NoopCommand();
   }

}
